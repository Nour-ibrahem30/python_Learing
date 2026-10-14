// Supabase Client Configuration
// يوفر عميلين: واحد للعمليات العادية وواحد للعمليات الإدارية

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// التحقق من وجود المتغيرات المطلوبة
if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

// العميل العادي - يستخدم الـ anon key
// يطبق Row Level Security (RLS) على جميع الاستعلامات
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// العميل الإداري - يستخدم الـ service key
// يتجاوز RLS - يُستخدم فقط للعمليات الإدارية مثل إدارة المستخدمين
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// تحذير إذا لم يكن الـ service key متوفراً
if (!supabaseAdmin) {
  console.warn('⚠️  SUPABASE_SERVICE_KEY not set - admin operations will not be available');
}

export default supabase;
