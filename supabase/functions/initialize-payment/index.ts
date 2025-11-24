import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const paymentSchema = z.object({
  courseId: z.string().uuid({ message: "Invalid course ID format" }),
  email: z.string().email({ message: "Invalid email format" }).max(255),
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }).max(20),
  paymentType: z.enum(['full', 'installment']).optional().default('full'),
  planId: z.string().uuid().optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = paymentSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid input data', details: validationResult.error.errors }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    const { courseId, email, fullName, phone, paymentType, planId } = validationResult.data;
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      throw new Error('Course not found');
    }

    let paymentAmount = course.price;
    let installmentInfo = null;

    // Handle installment payment
    if (paymentType === 'installment' && planId) {
      const { data: plan, error: planError } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('id', planId)
        .eq('course_id', courseId)
        .eq('is_active', true)
        .single();

      if (planError || !plan) {
        throw new Error('Invalid payment plan');
      }

      paymentAmount = plan.installment_amount;
      installmentInfo = {
        planId: plan.id,
        totalInstallments: plan.installment_count,
        installmentAmount: plan.installment_amount,
        totalAmount: plan.total_amount
      };
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: paymentAmount * 100, // Paystack expects amount in kobo (smallest unit)
        currency: 'NGN',
        metadata: {
          courseId,
          fullName,
          phone,
          courseName: course.title,
          paymentType,
          ...(installmentInfo && { installmentInfo })
        },
        callback_url: `${req.headers.get('origin')}/payment-success`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Payment initialization failed');
    }

    // Store payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        reference: paystackData.data.reference,
        course_id: courseId,
        amount: paymentAmount,
        status: 'pending',
        payment_method: 'paystack',
        metadata: { 
          email, 
          fullName, 
          phone, 
          courseName: course.title,
          paymentType,
          ...(installmentInfo && { installmentInfo })
        }
      });

    if (paymentError) {
      console.error('Error storing payment record:', paymentError);
    }

    console.log('Payment initialized successfully:', paystackData.data.reference);

    return new Response(
      JSON.stringify({
        authorizationUrl: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error initializing payment:', error);
    
    // Return safe error messages
    const safeMessage = error instanceof z.ZodError 
      ? 'Invalid input data provided'
      : 'Unable to process payment request';
    
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
