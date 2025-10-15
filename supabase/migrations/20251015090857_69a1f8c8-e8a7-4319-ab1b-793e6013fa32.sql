-- Add price column to courses table
ALTER TABLE courses ADD COLUMN price INTEGER NOT NULL DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN courses.price IS 'Course price in kobo (NGN currency smallest unit, e.g., 1500000 = ₦15,000)';

-- Create payments table to track all payment transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  metadata JSONB,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
ON public.payments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_payments_reference ON public.payments(reference);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);