-- Add UPDATE policy for payment_installments for admins
CREATE POLICY "Admins can update installments"
ON public.payment_installments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add INSERT policy for installment_payment_records for admins (if not covered by ALL)
CREATE POLICY "Admins can insert payment records"
ON public.installment_payment_records
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add UPDATE policy for installment_payment_records for admins
CREATE POLICY "Admins can update payment records"
ON public.installment_payment_records
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));