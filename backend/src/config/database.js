// Database configuration - migrated to Supabase
// هذا الملف موجود للتوافق مع الأكواد القديمة
// جميع العمليات الآن تستخدم Supabase

import { supabase, supabaseAdmin } from './supabase.js';

// Re-export Supabase clients for backward compatibility
export { supabase, supabaseAdmin };

// Default export is the regular client
export default supabase;

console.log('✅ Using Supabase database client');
