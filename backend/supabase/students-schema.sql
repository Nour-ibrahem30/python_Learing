-- ==========================================
-- نظام الطلاب بالكود والرمز
-- Students System with Code + PIN
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Valid Codes Table (الأكواد المسموح بيها)
-- الـ Admin بيضيف الأكواد هنا قبل ما الطالب يقدر يسجل
-- ==========================================

CREATE TABLE IF NOT EXISTS valid_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,          -- الكود المسموح بيه
  is_used BOOLEAN DEFAULT FALSE,       -- هل الكود اتستخدم؟
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  used_by UUID                         -- مين استخدم الكود
);

-- ==========================================
-- Students Table (بدل auth.users)
-- ==========================================

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,          -- الكود الخاص بالطالب (مثل AHMED123)
  name TEXT NOT NULL,                  -- اسم الطالب
  pin TEXT NOT NULL,                   -- الرمز السري
  role TEXT DEFAULT 'USER',            -- USER أو ADMIN
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ==========================================
-- Lesson Progress Tracking
-- ==========================================

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  status TEXT DEFAULT 'VIEWED',        -- VIEWED, IN_PROGRESS, COMPLETED
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_slug)
);

-- ==========================================
-- Watch History
-- ==========================================

CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  watch_time INTEGER DEFAULT 0,
  last_position INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_slug)
);

-- ==========================================
-- Indexes
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_students_code ON students(code);
CREATE INDEX IF NOT EXISTS idx_valid_codes_code ON valid_codes(code);
CREATE INDEX IF NOT EXISTS idx_valid_codes_unused ON valid_codes(code) WHERE is_used = FALSE;
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_student ON watch_history(student_id);

-- ==========================================
-- Enable Row Level Security
-- ==========================================

ALTER TABLE valid_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS Policies
-- ==========================================

-- Valid Codes: السماح بالقراءة فقط للتحقق
CREATE POLICY "valid_codes_select_all" ON valid_codes FOR SELECT USING (true);
CREATE POLICY "valid_codes_update_all" ON valid_codes FOR UPDATE USING (true);

-- Students: السماح بكل العمليات
CREATE POLICY "students_select_all" ON students FOR SELECT USING (true);
CREATE POLICY "students_insert_all" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "students_update_all" ON students FOR UPDATE USING (true);

-- Lesson Progress: السماح بكل العمليات
CREATE POLICY "progress_select_all" ON lesson_progress FOR SELECT USING (true);
CREATE POLICY "progress_insert_all" ON lesson_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "progress_update_all" ON lesson_progress FOR UPDATE USING (true);
CREATE POLICY "progress_delete_all" ON lesson_progress FOR DELETE USING (true);

-- Watch History: السماح بكل العمليات
CREATE POLICY "history_select_all" ON watch_history FOR SELECT USING (true);
CREATE POLICY "history_insert_all" ON watch_history FOR INSERT WITH CHECK (true);
CREATE POLICY "history_update_all" ON watch_history FOR UPDATE USING (true);
CREATE POLICY "history_delete_all" ON watch_history FOR DELETE USING (true);

-- ==========================================
-- إضافة Admin افتراضي
-- ⚠️ غيّر الرمز بعد أول دخول!
-- ==========================================

INSERT INTO students (code, name, pin, role) 
VALUES ('ADMIN', 'نور إبراهيم', 'Nawar2024!', 'ADMIN')
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- إضافة أكواد تجريبية للطلاب
-- انت كـ Admin هتضيف الأكواد دي يدوي من Supabase Dashboard
-- أو من لوحة التحكم لما نعملها
-- ==========================================

-- مثال: إضافة 5 أكواد تجريبية
-- INSERT INTO valid_codes (code) VALUES 
--   ('STD2024001'),
--   ('STD2024002'),
--   ('STD2024003'),
--   ('STD2024004'),
--   ('STD2024005');
