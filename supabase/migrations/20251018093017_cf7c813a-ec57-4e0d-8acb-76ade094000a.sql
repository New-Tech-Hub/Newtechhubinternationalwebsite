-- Add video preview URL column to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS video_preview_url TEXT;