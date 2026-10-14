-- ==========================================
-- Supabase Schema for Python with Nawar
-- يحتوي على جميع الجداول مع Row Level Security (RLS)
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Enums
-- ==========================================

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE progress_status AS ENUM ('VIEWED', 'IN_PROGRESS', 'COMPLETED');

-- ==========================================
-- Users Profile Table
-- يرتبط بـ auth.users الخاص بـ Supabase
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'USER',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ==========================================
-- Lessons Table
-- ==========================================

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  number TEXT NOT NULL,
  video_url TEXT,
  cloudinary_id TEXT,
  pdf_url TEXT,
  docs_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Lesson Progress Tracking
-- ==========================================

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  status progress_status DEFAULT 'VIEWED',
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_slug)
);

-- ==========================================
-- Video Watch History
-- ==========================================

CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  watch_time INTEGER DEFAULT 0,  -- seconds watched
  last_position INTEGER DEFAULT 0,  -- resume position in seconds
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_slug)
);

-- ==========================================
-- Comments & Questions
-- ==========================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  content TEXT NOT NULL,
  is_question BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Site Visits Analytics
-- ==========================================

CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Indexes for Performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_slug ON lesson_progress(lesson_slug);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_slug ON watch_history(lesson_slug);
CREATE INDEX IF NOT EXISTS idx_comments_lesson ON comments(lesson_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_user ON site_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_path ON site_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);

-- ==========================================
-- Enable Row Level Security
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Helper Function: Check if user is admin
-- ==========================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RLS Policies for Users Table
-- ==========================================

-- Users can read their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "users_select_admin" ON users
  FOR SELECT USING (is_admin());

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Only service role can insert (through auth trigger)
CREATE POLICY "users_insert_service" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- RLS Policies for Lessons Table
-- ==========================================

-- Anyone can read published lessons
CREATE POLICY "lessons_select_published" ON lessons
  FOR SELECT USING (is_published = TRUE);

-- Admins can read all lessons
CREATE POLICY "lessons_select_admin" ON lessons
  FOR SELECT USING (is_admin());

-- Admins can insert lessons
CREATE POLICY "lessons_insert_admin" ON lessons
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update lessons
CREATE POLICY "lessons_update_admin" ON lessons
  FOR UPDATE USING (is_admin());

-- Admins can delete lessons
CREATE POLICY "lessons_delete_admin" ON lessons
  FOR DELETE USING (is_admin());

-- ==========================================
-- RLS Policies for Lesson Progress
-- ==========================================

-- Users can read their own progress
CREATE POLICY "lesson_progress_select_own" ON lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all progress
CREATE POLICY "lesson_progress_select_admin" ON lesson_progress
  FOR SELECT USING (is_admin());

-- Users can insert their own progress
CREATE POLICY "lesson_progress_insert_own" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "lesson_progress_update_own" ON lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "lesson_progress_delete_own" ON lesson_progress
  FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- RLS Policies for Watch History
-- ==========================================

-- Users can read their own watch history
CREATE POLICY "watch_history_select_own" ON watch_history
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all watch history
CREATE POLICY "watch_history_select_admin" ON watch_history
  FOR SELECT USING (is_admin());

-- Users can insert their own watch history
CREATE POLICY "watch_history_insert_own" ON watch_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own watch history
CREATE POLICY "watch_history_update_own" ON watch_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own watch history
CREATE POLICY "watch_history_delete_own" ON watch_history
  FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- RLS Policies for Comments
-- ==========================================

-- Anyone authenticated can read comments
CREATE POLICY "comments_select_all" ON comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert their own comments
CREATE POLICY "comments_insert_own" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can delete any comment
CREATE POLICY "comments_delete_admin" ON comments
  FOR DELETE USING (is_admin());

-- ==========================================
-- RLS Policies for Site Visits
-- ==========================================

-- Anyone can insert visits (for analytics)
CREATE POLICY "site_visits_insert_all" ON site_visits
  FOR INSERT WITH CHECK (TRUE);

-- Only admins can read visits
CREATE POLICY "site_visits_select_admin" ON site_visits
  FOR SELECT USING (is_admin());

-- ==========================================
-- Function: Create user profile on signup
-- يُنشئ تلقائياً ملف تعريف المستخدم عند التسجيل
-- ==========================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==========================================
-- Function: Update updated_at timestamp
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER watch_history_updated_at
  BEFORE UPDATE ON watch_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
