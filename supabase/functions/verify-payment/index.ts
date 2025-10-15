import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const verifySchema = z.object({
  reference: z.string().min(1).max(100)
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = verifySchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment reference' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    const { reference } = validationResult.data;
    
    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      throw new Error('Payment verification failed');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Sanitize metadata
    const metadata = paystackData.data.metadata || {};
    const courseId = String(metadata.courseId || '').trim();
    const fullName = String(metadata.fullName || '').slice(0, 100).trim();
    const phone = String(metadata.phone || '').slice(0, 20).trim();
    const email = String(paystackData.data.customer?.email || '').slice(0, 255).trim();

    if (!courseId || !email) {
      throw new Error('Missing required payment metadata');
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    let userId = existingUser?.id;

    // Create user if doesn't exist
    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          phone,
        },
      });

      if (authError) throw authError;
      userId = authData.user.id;
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: 'success',
        user_id: userId,
        verified_at: new Date().toISOString()
      })
      .eq('reference', reference);

    // Enroll user in course (idempotent)
    const { error: enrollError } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
      });

    if (enrollError && !enrollError.message.includes('duplicate')) {
      throw enrollError;
    }

    console.log('Payment verified and user enrolled:', { userId, courseId, reference });

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        courseId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    
    // Return safe error message
    const safeMessage = 'Unable to verify payment. Please contact support.';
    
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
