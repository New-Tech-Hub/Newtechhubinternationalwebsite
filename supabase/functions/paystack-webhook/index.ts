import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get webhook signature
    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
      console.error('Missing webhook signature');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Get raw body
    const body = await req.text();
    
    // Verify webhook signature
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
    const encoder = new TextEncoder();
    const keyData = encoder.encode(paystackSecret);
    const messageData = encoder.encode(body);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Parse event
    const event = JSON.parse(body);
    console.log('Webhook event received:', event.event);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle charge success event
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const metadata = event.data.metadata || {};
      const courseId = String(metadata.courseId || '').trim();
      const fullName = String(metadata.fullName || '').slice(0, 100).trim();
      const phone = String(metadata.phone || '').slice(0, 20).trim();
      const email = String(event.data.customer?.email || '').slice(0, 255).trim();

      if (!courseId || !email || !reference) {
        console.error('Missing required webhook data');
        return new Response(JSON.stringify({ status: 'error' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // Check if already processed
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('status, user_id')
        .eq('reference', reference)
        .single();

      if (existingPayment?.status === 'success') {
        console.log('Payment already processed:', reference);
        return new Response(JSON.stringify({ status: 'already_processed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
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

        if (authError) {
          console.error('Error creating user:', authError);
          throw authError;
        }
        userId = authData.user.id;
      }

      // Update payment record
      const { data: paymentData } = await supabase
        .from('payments')
        .update({
          status: 'success',
          user_id: userId,
          verified_at: new Date().toISOString()
        })
        .eq('reference', reference)
        .select()
        .single();

      // Check if this is an installment payment
      const paymentMetadata = paymentData?.metadata as any;
      const paymentType = paymentMetadata?.paymentType;
      const installmentInfo = paymentMetadata?.installmentInfo;

      if (paymentType === 'installment' && installmentInfo) {
        // Check if installment record exists
        const { data: existingInstallment } = await supabase
          .from('payment_installments')
          .select('*')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .eq('plan_id', installmentInfo.planId)
          .single();

        let installmentId;
        let currentInstallmentNum = 1;

        if (existingInstallment) {
          // Update existing installment record
          currentInstallmentNum = existingInstallment.current_installment + 1;
          const totalPaid = existingInstallment.total_paid + installmentInfo.installmentAmount;
          const nextPaymentDate = new Date();
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

          await supabase
            .from('payment_installments')
            .update({
              current_installment: currentInstallmentNum,
              total_paid: totalPaid,
              next_payment_date: currentInstallmentNum < installmentInfo.totalInstallments 
                ? nextPaymentDate.toISOString() 
                : null,
              status: currentInstallmentNum >= installmentInfo.totalInstallments ? 'completed' : 'active'
            })
            .eq('id', existingInstallment.id);

          installmentId = existingInstallment.id;
        } else {
          // Create new installment record
          const nextPaymentDate = new Date();
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

          const { data: newInstallment } = await supabase
            .from('payment_installments')
            .insert({
              user_id: userId,
              course_id: courseId,
              plan_id: installmentInfo.planId,
              total_installments: installmentInfo.totalInstallments,
              current_installment: 1,
              installment_amount: installmentInfo.installmentAmount,
              total_paid: installmentInfo.installmentAmount,
              total_amount: installmentInfo.totalAmount,
              next_payment_date: nextPaymentDate.toISOString(),
              status: 'active'
            })
            .select()
            .single();

          installmentId = newInstallment.id;
        }

        // Record this installment payment
        await supabase
          .from('installment_payment_records')
          .insert({
            installment_id: installmentId,
            payment_id: paymentData.id,
            installment_number: currentInstallmentNum,
            amount: installmentInfo.installmentAmount,
            status: 'paid',
            paid_at: new Date().toISOString()
          });

        // Grant course access on first installment payment
        if (currentInstallmentNum === 1) {
          await supabase
            .from('user_course_access')
            .insert({
              user_id: userId,
              course_id: courseId
            });
        }
      } else {
        // Full payment - grant immediate access
        await supabase
          .from('user_course_access')
          .insert({
            user_id: userId,
            course_id: courseId
          });
      }

      // Enroll user in course (idempotent)
      const { error: enrollError } = await supabase
        .from('user_enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
        });

      if (enrollError && !enrollError.message.includes('duplicate')) {
        console.error('Error enrolling user:', enrollError);
        throw enrollError;
      }

      console.log('Webhook: Payment verified and user enrolled:', { userId, courseId, reference });
    }

    return new Response(
      JSON.stringify({ status: 'success' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
