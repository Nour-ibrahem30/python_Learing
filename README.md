<div align="center">

# 🐍 بايثون مع نوار

### منصة تعليم Python بالعربي المصري

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat&logo=vercel)](https://vercel.com/)

<img src="frontend/src/assets/hero.png" alt="Python with Nawar" width="400"/>

**تعلم Python من الصفر بالمصري! 🇪🇬**

[🌐 الموقع](https://python-with-nawar.vercel.app) · [📺 YouTube](https://www.youtube.com/channel/UCLm1BmQbIiJ2Knm1WSkj7_Q) · [💼 Portfolio](https://nouribrahem.vercel.app/)

</div>

---

## ✨ المميزات

- 🎥 **فيديوهات تعليمية** - شرح Python بالمصري
- 📚 **دروس مرتبة** - من المبتدئ للمتقدم
- 🔐 **نظام تسجيل دخول** - بكود ورمز (بدون Email)
- 📊 **تتبع التقدم** - شوف الدروس اللي خلصتها
- 🌙 **الوضع الليلي** - Dark Mode
- 📱 **متجاوب** - يشتغل على الموبايل والكمبيوتر
- ⚡ **سريع** - مبني بـ React + Vite

---

## 📁 هيكل المشروع

```
python_Learing/
├── 📂 frontend/              # React + Vite
│   ├── src/
│   │   ├── components/       # المكونات
│   │   ├── pages/            # الصفحات
│   │   ├── context/          # Auth Context
│   │   ├── hooks/            # Custom Hooks
│   │   ├── data/             # بيانات الدروس
│   │   └── styles/           # CSS
│   └── package.json
│
├── 📂 backend/               # Node.js + Express + Supabase
│   ├── src/
│   │   ├── controllers/      # API Controllers
│   │   ├── routes/           # API Routes
│   │   └── middleware/       # Auth Middleware
│   ├── supabase/
│   │   └── students-schema.sql
│   └── package.json
│
└── README.md
```

---

## 🚀 التشغيل المحلي

### المتطلبات

- Node.js 18+
- حساب [Supabase](https://supabase.com) (مجاني)

### 1️⃣ Frontend

```bash
cd frontend
npm install
```

أنشئ ملف `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

🌐 يشتغل على: http://localhost:5173

### 2️⃣ إعداد Supabase

1. أنشئ مشروع جديد على [supabase.com](https://supabase.com)
2. روح على **SQL Editor**
3. شغّل الكود من ملف `backend/supabase/students-schema.sql`

### 3️⃣ Backend (اختياري)

```bash
cd backend
npm install
```

أنشئ ملف `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
PORT=5000
```

```bash
npm run dev
```

🌐 يشتغل على: http://localhost:5000

---

## 🔐 نظام تسجيل الدخول

النظام بيستخدم **كود + رمز** بدل Email:

| الحقل | الوصف | مثال |
|-------|-------|------|
| الكود | معرف فريد للطالب | `AHMED123` |
| الرمز | كلمة السر | `MyP@ss99` |

### الرموز الممنوعة:
- ❌ `1234`, `123456` (متسلسلة)
- ❌ `0000`, `1111` (متكررة)
- ❌ `password`, `admin` (شائعة)

---

## 🌐 Deploy على Vercel

### Frontend

1. ارفع المشروع على GitHub
2. روح على [vercel.com](https://vercel.com)
3. اعمل Import للـ repo
4. **Root Directory**: `frontend`
5. أضف Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. اضغط Deploy! 🚀

---

## 🛠️ التقنيات المستخدمة

| Frontend | Backend | Database |
|----------|---------|----------|
| React 19 | Node.js | Supabase (PostgreSQL) |
| Vite 8 | Express | Row Level Security |
| Framer Motion | - | - |
| React Router 7 | - | - |

---

## 📚 الدروس المتوفرة

1. **المقدمة** - ليه نتعلم Python؟
2. **المتغيرات** - Variables & Types
3. **العمليات** - Operators
4. **الشروط** - If Statements
5. **الحلقات** - Loops (for, while)
6. **الدوال** - Functions
7. **القوائم** - Lists
8. **القواميس** - Dictionaries
9. **الملفات** - File Handling
10. **مشاريع** - Real Projects

---

## 👨‍💻 المطور

<div align="center">

**نور إبراهيم**

[![GitHub](https://img.shields.io/badge/GitHub-Nour--ibrahem30-181717?style=flat&logo=github)](https://github.com/Nour-ibrahem30)
[![Portfolio](https://img.shields.io/badge/Portfolio-nouribrahem.vercel.app-000?style=flat&logo=vercel)](https://nouribrahem.vercel.app/)
[![YouTube](https://img.shields.io/badge/YouTube-بايثون_مع_نوار-FF0000?style=flat&logo=youtube)](https://www.youtube.com/channel/UCLm1BmQbIiJ2Knm1WSkj7_Q)

</div>

---

## 📄 الرخصة

هذا المشروع مفتوح المصدر تحت رخصة [MIT](LICENSE).

---

<div align="center">

**⭐ لو المشروع عجبك، اعمله Star على GitHub!**

Made with ❤️ in Egypt 🇪🇬

</div>
