-- Create enum for course categories
CREATE TYPE public.course_category AS ENUM (
  'digital_marketing',
  'web_development', 
  'graphic_design',
  'ai_data',
  'cybersecurity',
  'video_editing',
  'freelancing'
);

-- Create enum for difficulty levels
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create enum for video status
CREATE TYPE public.video_status AS ENUM ('pending_review', 'approved', 'rejected', 'broken', 'removed');

-- Create enum for license types
CREATE TYPE public.license_type AS ENUM (
  'youtube_standard',
  'creative_commons_by',
  'creative_commons_by_sa',
  'creative_commons_by_nc',
  'creative_commons_by_nc_sa',
  'mit_opencourseware',
  'public_domain',
  'other'
);

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category course_category NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  thumbnail_url TEXT,
  is_free BOOLEAN DEFAULT false,
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false
);

-- Learning paths / course groupings
CREATE TABLE public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category course_category NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  estimated_completion_time INTEGER, -- in hours
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Videos/Lessons table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT NOT NULL,
  embed_code TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  language TEXT DEFAULT 'en',
  author_channel TEXT,
  category course_category NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  license_type license_type NOT NULL,
  license_details TEXT,
  attribution TEXT,
  source_platform TEXT, -- youtube, vimeo, etc
  quality_rating DECIMAL(2,1), -- 0.0 to 5.0
  engagement_score INTEGER, -- views, likes, etc
  status video_status DEFAULT 'pending_review',
  admin_notes TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  imported_by UUID REFERENCES auth.users(id)
);

-- Course-video mapping (many-to-many)
CREATE TABLE public.course_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, video_id)
);

-- Learning path courses mapping
CREATE TABLE public.learning_path_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(learning_path_id, course_id)
);

-- User progress tracking
CREATE TABLE public.user_video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_seconds INTEGER DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- User course enrollments
CREATE TABLE public.user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Import logs for tracking automated imports
CREATE TABLE public.video_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  import_source TEXT,
  import_method TEXT,
  success BOOLEAN,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Weekly reports
CREATE TABLE public.import_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date DATE NOT NULL,
  videos_added INTEGER DEFAULT 0,
  videos_flagged INTEGER DEFAULT 0,
  sources_checked TEXT[],
  summary TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage all courses"
  ON public.courses FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for learning paths
CREATE POLICY "Anyone can view learning paths"
  ON public.learning_paths FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage learning paths"
  ON public.learning_paths FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for videos
CREATE POLICY "Anyone can view approved videos"
  ON public.videos FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can manage all videos"
  ON public.videos FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for course_videos
CREATE POLICY "Anyone can view course videos"
  ON public.course_videos FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage course videos"
  ON public.course_videos FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for learning_path_courses
CREATE POLICY "Anyone can view learning path courses"
  ON public.learning_path_courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage learning path courses"
  ON public.learning_path_courses FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user progress
CREATE POLICY "Users can view their own progress"
  ON public.user_video_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_video_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress"
  ON public.user_video_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.user_video_progress FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.user_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves"
  ON public.user_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
  ON public.user_enrollments FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for import logs
CREATE POLICY "Admins can view import logs"
  ON public.video_import_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create import logs"
  ON public.video_import_logs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for reports
CREATE POLICY "Admins can view reports"
  ON public.import_reports FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create reports"
  ON public.import_reports FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_published ON public.courses(published);
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_last_checked ON public.videos(last_checked_at);
CREATE INDEX idx_user_progress_user ON public.user_video_progress(user_id);
CREATE INDEX idx_user_progress_video ON public.user_video_progress(video_id);
CREATE INDEX idx_enrollments_user ON public.user_enrollments(user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();