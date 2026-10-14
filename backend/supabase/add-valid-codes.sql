-- ==========================================
-- إضافة جدول الأكواد المسموح بيها
-- شغل الـ SQL ده في Supabase Dashboard > SQL Editor
-- ==========================================

-- إنشاء جدول الأكواد المسموح بيها
CREATE TABLE IF NOT EXISTS valid_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,          -- الكود المسموح بيه
  is_used BOOLEAN DEFAULT FALSE,       -- هل الكود اتستخدم؟
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  used_by UUID                         -- مين استخدم الكود
);

-- Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_valid_codes_code ON valid_codes(code);
CREATE INDEX IF NOT EXISTS idx_valid_codes_unused ON valid_codes(code) WHERE is_used = FALSE;

-- Enable RLS
ALTER TABLE valid_codes ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "valid_codes_select_all" ON valid_codes;
DROP POLICY IF EXISTS "valid_codes_update_all" ON valid_codes;

CREATE POLICY "valid_codes_select_all" ON valid_codes FOR SELECT USING (true);
CREATE POLICY "valid_codes_update_all" ON valid_codes FOR UPDATE USING (true);

-- ==========================================
-- إضافة بعض الأكواد التجريبية
-- غيرهم بالأكواد اللي انت عايزها
-- ==========================================

INSERT INTO valid_codes (code) VALUES 
  ('STD2024001'),
  ('STD2024002'),
  ('STD2024003'),
  ('STD2024004'),
  ('STD2024005'),
  ('STD2024006'),
  ('STD2024007'),
  ('STD2024008'),
  ('STD2024009'),
  ('STD2024010')
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- عشان تضيف أكواد جديدة بعدين:
-- INSERT INTO valid_codes (code) VALUES ('NEWCODE123');
-- 
-- عشان تشوف الأكواد اللي مش مستخدمة:
-- SELECT * FROM valid_codes WHERE is_used = FALSE;
-- 
-- عشان تشوف مين استخدم كود معين:
-- SELECT vc.code, s.name, vc.used_at 
-- FROM valid_codes vc 
-- LEFT JOIN students s ON s.id = vc.used_by 
-- WHERE vc.is_used = TRUE;
-- ==========================================
