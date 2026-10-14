// Supabase Seed Script
// يُنشئ بيانات أولية للتطبيق

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  console.error('Please set these environment variables in your .env file');
  process.exit(1);
}

// استخدام الـ service key للعمليات الإدارية
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// بيانات الدروس
const lessons = [
  { slug: 'whetting-appetite', title: 'Whetting Your Appetite', title_ar: 'ليه Python؟ وليه تتعلمها؟', category: 'basics', number: '01', is_published: true },
  { slug: 'using-interpreter', title: 'Using the Python Interpreter', title_ar: 'إزاي تشغّل Python على جهازك', category: 'basics', number: '02', is_published: true },
  { slug: 'informal-intro', title: 'An Informal Introduction to Python', title_ar: 'أول خطواتك في Python', category: 'basics', number: '03', is_published: true },
  { slug: 'if-statements', title: 'if Statements', title_ar: 'الشروط باستخدام if', category: 'practice', number: '04', is_published: true },
  { slug: 'for-statements', title: 'for Statements', title_ar: 'التكرار باستخدام for', category: 'practice', number: '05', is_published: true },
  { slug: 'range-function', title: 'The range() Function', title_ar: 'دالة range() للأرقام', category: 'practice', number: '06', is_published: true },
  { slug: 'break-continue', title: 'break and continue Statements', title_ar: 'التحكم في الـ Loop بـ break و continue', category: 'practice', number: '07', is_published: true },
  { slug: 'defining-functions', title: 'Defining Functions', title_ar: 'إزاي تكتب Function', category: 'practice', number: '08', is_published: true },
  { slug: 'default-arguments', title: 'Default Argument Values', title_ar: 'القيم الافتراضية للـ Arguments', category: 'practice', number: '09', is_published: true },
  { slug: 'lambda-expressions', title: 'Lambda Expressions', title_ar: 'الدوال المختصرة Lambda', category: 'practice', number: '10', is_published: true },
  { slug: 'more-on-lists', title: 'More on Lists', title_ar: 'كل حاجة عن Lists', category: 'basics', number: '11', is_published: true },
  { slug: 'list-comprehensions', title: 'List Comprehensions', title_ar: 'الطريقة الذكية لعمل Lists', category: 'practice', number: '12', is_published: true },
  { slug: 'tuples-sequences', title: 'Tuples and Sequences', title_ar: 'الـ Tuples والـ Sequences', category: 'basics', number: '13', is_published: true },
  { slug: 'sets', title: 'Sets', title_ar: 'الـ Sets - المجموعات', category: 'basics', number: '14', is_published: true },
  { slug: 'dictionaries', title: 'Dictionaries', title_ar: 'الـ Dictionaries - القواميس', category: 'basics', number: '15', is_published: true },
  { slug: 'fancier-output', title: 'Fancier Output Formatting', title_ar: 'تنسيق المخرجات', category: 'practice', number: '16', is_published: true },
  { slug: 'reading-writing-files', title: 'Reading and Writing Files', title_ar: 'قراءة وكتابة الملفات', category: 'practice', number: '17', is_published: true },
  { slug: 'errors-exceptions', title: 'Errors and Exceptions', title_ar: 'التعامل مع الأخطاء', category: 'practice', number: '18', is_published: true },
  { slug: 'project-calculator', title: 'Project: Simple Calculator', title_ar: 'مشروع: آلة حاسبة بسيطة', category: 'projects', number: '19', is_published: true },
  { slug: 'project-guessing-game', title: 'Project: Guessing Game', title_ar: 'مشروع: لعبة تخمين الرقم', category: 'projects', number: '20', is_published: true },
];

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // 1. إنشاء المستخدم الإداري
    console.log('Creating admin user...');
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@pythonwithnawar.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'نور إبراهيم',
      },
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('⚠️  Admin user already exists, skipping...');
        
        // جلب المستخدم الموجود
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingAdmin = existingUsers?.users?.find(u => u.email === 'admin@pythonwithnawar.com');
        
        if (existingAdmin) {
          // تحديث الملف الشخصي ليكون admin
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ role: 'ADMIN', is_verified: true, name: 'نور إبراهيم' })
            .eq('id', existingAdmin.id);
          
          if (updateError) {
            console.log('⚠️  Could not update admin role:', updateError.message);
          } else {
            console.log('✅ Admin role updated');
          }
        }
      } else {
        throw authError;
      }
    } else if (authUser?.user) {
      console.log('✅ Admin auth user created:', authUser.user.email);
      
      // تحديث الملف الشخصي ليكون admin
      // (التريجر يُنشئ الملف تلقائياً، نحتاج فقط تحديث الدور)
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .update({ role: 'ADMIN', is_verified: true })
        .eq('id', authUser.user.id);

      if (profileError) {
        console.log('⚠️  Could not update admin profile:', profileError.message);
      } else {
        console.log('✅ Admin profile updated');
      }
    }

    // 2. إضافة الدروس
    console.log('\nSeeding lessons...');
    
    for (const lesson of lessons) {
      const { error: lessonError } = await supabaseAdmin
        .from('lessons')
        .upsert(lesson, { onConflict: 'slug' });

      if (lessonError) {
        console.error(`❌ Error inserting lesson ${lesson.slug}:`, lessonError.message);
      }
    }
    
    console.log(`✅ Lessons seeded: ${lessons.length}`);

    console.log('\n🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
