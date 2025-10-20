-- Add instructor profiles table
CREATE TABLE public.instructor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  bio text,
  expertise text[],
  profile_image_url text,
  linkedin_url text,
  twitter_url text,
  years_experience integer,
  students_taught integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add testimonials table
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  role text,
  company text,
  location text,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  content text NOT NULL,
  image_url text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  outcome_achieved text,
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add certifications table
CREATE TABLE public.certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  verification_url text,
  skills_acquired text[],
  UNIQUE(user_id, course_id)
);

-- Add community forums table
CREATE TABLE public.forums (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add forum posts table
CREATE TABLE public.forum_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  forum_id uuid REFERENCES public.forums(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add partnerships table
CREATE TABLE public.partnerships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name text NOT NULL,
  partner_type text NOT NULL, -- university, company, government, telecom, ngo
  logo_url text,
  description text,
  website_url text,
  location text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add outcome tracking table
CREATE TABLE public.learner_outcomes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  completion_date timestamp with time zone,
  skills_gained text[],
  employment_status text,
  job_title text,
  salary_range text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Extend courses table with new fields
ALTER TABLE public.courses
ADD COLUMN prerequisites text[],
ADD COLUMN learning_outcomes text[],
ADD COLUMN instructor_id uuid REFERENCES public.instructor_profiles(id),
ADD COLUMN language text DEFAULT 'en',
ADD COLUMN subtitles_available text[],
ADD COLUMN is_offline_available boolean DEFAULT false,
ADD COLUMN file_size_mb integer,
ADD COLUMN certificate_available boolean DEFAULT true,
ADD COLUMN target_audience text,
ADD COLUMN real_world_projects text[];

-- Enable RLS on all new tables
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_outcomes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructor_profiles
CREATE POLICY "Anyone can view instructor profiles"
  ON public.instructor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Instructors can update their own profile"
  ON public.instructor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage instructor profiles"
  ON public.instructor_profiles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can create their own testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonials"
  ON public.testimonials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all testimonials"
  ON public.testimonials FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for certifications
CREATE POLICY "Users can view their own certifications"
  ON public.certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage certifications"
  ON public.certifications FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for forums
CREATE POLICY "Anyone can view forums"
  ON public.forums FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forums"
  ON public.forums FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can manage forums"
  ON public.forums FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for forum_posts
CREATE POLICY "Anyone can view forum posts"
  ON public.forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.forum_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.forum_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all posts"
  ON public.forum_posts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for partnerships
CREATE POLICY "Anyone can view active partnerships"
  ON public.partnerships FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage partnerships"
  ON public.partnerships FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for learner_outcomes
CREATE POLICY "Anyone can view public outcomes"
  ON public.learner_outcomes FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own outcomes"
  ON public.learner_outcomes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own outcomes"
  ON public.learner_outcomes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all outcomes"
  ON public.learner_outcomes FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_instructor_profiles_updated_at
  BEFORE UPDATE ON public.instructor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learner_outcomes_updated_at
  BEFORE UPDATE ON public.learner_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();