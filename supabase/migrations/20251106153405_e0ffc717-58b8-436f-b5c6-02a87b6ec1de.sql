-- Create course access codes table
CREATE TABLE public.course_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  access_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0
);

-- Create user course access table
CREATE TABLE public.user_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  access_code_id UUID REFERENCES public.course_access_codes(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.course_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_access_codes
CREATE POLICY "Admins can manage access codes"
ON public.course_access_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_course_access
CREATE POLICY "Admins can manage user access"
ON public.user_course_access
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own access"
ON public.user_course_access
FOR SELECT
USING (auth.uid() = user_id);

-- Create function to verify course access
CREATE OR REPLACE FUNCTION public.verify_course_access(
  _user_id UUID,
  _course_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if user is admin
  SELECT CASE 
    WHEN has_role(_user_id, 'admin'::app_role) THEN true
    ELSE EXISTS (
      -- Check if user has paid and has valid access code
      SELECT 1
      FROM public.user_course_access uca
      WHERE uca.user_id = _user_id 
        AND uca.course_id = _course_id
    )
  END;
$$;

-- Create indexes for performance
CREATE INDEX idx_course_access_codes_course_id ON public.course_access_codes(course_id);
CREATE INDEX idx_user_course_access_user_course ON public.user_course_access(user_id, course_id);