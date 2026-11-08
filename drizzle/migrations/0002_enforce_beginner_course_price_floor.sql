ALTER TABLE public.courses
ADD CONSTRAINT courses_beginner_price_floor
CHECK (difficulty_level <> 'beginner' OR price >= 120000);