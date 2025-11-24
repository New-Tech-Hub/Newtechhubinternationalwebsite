-- Create payment plans table to track installment configurations
CREATE TABLE IF NOT EXISTS public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  plan_name TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  installment_count INTEGER NOT NULL,
  installment_amount INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payment installments table to track individual installment payments
CREATE TABLE IF NOT EXISTS public.payment_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  plan_id UUID REFERENCES public.payment_plans(id),
  total_installments INTEGER NOT NULL,
  current_installment INTEGER NOT NULL DEFAULT 1,
  installment_amount INTEGER NOT NULL,
  total_paid INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  next_payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create installment payments tracking table
CREATE TABLE IF NOT EXISTS public.installment_payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id UUID NOT NULL REFERENCES public.payment_installments(id),
  payment_id UUID REFERENCES public.payments(id),
  installment_number INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_payment_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_plans
CREATE POLICY "Anyone can view active payment plans"
  ON public.payment_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage payment plans"
  ON public.payment_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for payment_installments
CREATE POLICY "Users can view their own installments"
  ON public.payment_installments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own installments"
  ON public.payment_installments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all installments"
  ON public.payment_installments FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for installment_payment_records
CREATE POLICY "Users can view their installment payment records"
  ON public.installment_payment_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.payment_installments pi
      WHERE pi.id = installment_payment_records.installment_id
      AND pi.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage installment payment records"
  ON public.installment_payment_records FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_payment_plans_updated_at
  BEFORE UPDATE ON public.payment_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_installments_updated_at
  BEFORE UPDATE ON public.payment_installments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default installment plans for premium courses (400k+)
INSERT INTO public.payment_plans (course_id, plan_name, total_amount, installment_count, installment_amount)
SELECT 
  id as course_id,
  '3-Month Plan' as plan_name,
  price as total_amount,
  3 as installment_count,
  CEIL(price / 3.0) as installment_amount
FROM public.courses
WHERE price >= 400000 AND published = true
ON CONFLICT DO NOTHING;

INSERT INTO public.payment_plans (course_id, plan_name, total_amount, installment_count, installment_amount)
SELECT 
  id as course_id,
  '6-Month Plan' as plan_name,
  price as total_amount,
  6 as installment_count,
  CEIL(price / 6.0) as installment_amount
FROM public.courses
WHERE price >= 400000 AND published = true
ON CONFLICT DO NOTHING;