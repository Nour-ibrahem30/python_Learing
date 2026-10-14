# Implementation Plan: Supabase Migration

هجرة الـ Backend من Prisma + PostgreSQL إلى Supabase، وتحديث الـ Frontend Auth لاستخدام Supabase مباشرة.

## Overview

This migration replaces:
- **Prisma ORM** → **Supabase JS Client** (@supabase/supabase-js)
- **Manual JWT Auth** → **Supabase Auth** (built-in user management)
- **Custom PostgreSQL** → **Supabase Hosted PostgreSQL** (with RLS)

The REST API structure stays the same for backward compatibility.

---

## Implementation Plan

- [ ] 1. **Update backend dependencies and create Supabase client config**
      Remove Prisma packages, add @supabase/supabase-js, create client initialization.
      Files: 
        - backend/package.json
        - backend/src/config/supabase.js (new)
        - backend/.env.example
      Verify: `npm install` in backend completes without errors.

- [ ] 2. **Create Supabase SQL schema with RLS policies**
      Create schema.sql with all tables matching Prisma schema, enable RLS, define policies.
      Files:
        - backend/supabase/schema.sql (new)
      Verify: SQL syntax is valid (manual review).

      **Tables to create:**
      - `profiles` (extends auth.users): id, name, avatar_url, role, is_verified, last_login
      - `lesson_progress`: id, user_id, lesson_slug, status, progress_percent, started_at, completed_at
      - `watch_history`: id, user_id, lesson_slug, watch_time, last_position, updated_at  
      - `comments`: id, user_id, lesson_slug, content, is_question, parent_id, timestamps
      - `site_visits`: id, user_id (nullable), page_path, user_agent, ip_address, visited_at
      - `lessons`: id, slug (unique), title, title_ar, description, category, number, video_url, cloudinary_id, pdf_url, docs_url, is_published, timestamps

      **RLS Policies:**
      - profiles: users read own, admins read all
      - lesson_progress/watch_history: users CRUD own
      - comments: public read, users CRUD own
      - site_visits: public insert, admin select
      - lessons: public select where is_published=true, admin full CRUD

- [ ] 3. **Create Supabase seed script**
      Migrate prisma/seed.js to use Supabase client for seeding admin user and lessons.
      Files:
        - backend/supabase/seed.js (new)
      Verify: Script runs without syntax errors when Supabase credentials are configured.

- [ ] 4. **Update auth middleware to use Supabase Auth**
      Replace JWT verification with supabase.auth.getUser(), query profiles table for user data.
      Files:
        - backend/src/middleware/auth.js
      Verify: `npm run dev` starts server without import errors.

      **Mapping:**
      - `jwt.verify(token, secret)` → `supabase.auth.getUser(token)`
      - `prisma.user.findUnique({where:{id}})` → `supabase.from('profiles').select().eq('id', userId).single()`

- [ ] 5. **Update auth.controller.js for Supabase Auth**
      Replace bcrypt + Prisma user creation with Supabase Auth methods.
      Files:
        - backend/src/controllers/auth.controller.js
      Verify: Server starts without errors.

      **Mapping:**
      - `bcrypt.hash + prisma.user.create` → `supabase.auth.signUp()`
      - `prisma.user.findUnique + bcrypt.compare` → `supabase.auth.signInWithPassword()`
      - `generateToken()` → return `session.access_token` from Supabase
      - `prisma.user.update` → `supabase.from('profiles').update()`
      - `bcrypt.hash + prisma.user.update` → `supabase.auth.updateUser({password})`

- [ ] 6. **Update lesson.controller.js for Supabase**
      Replace all Prisma calls with Supabase client calls.
      Files:
        - backend/src/controllers/lesson.controller.js
      Verify: Server starts without errors.

      **Mapping:**
      - `prisma.lesson.findMany({where, orderBy})` → `supabase.from('lessons').select().eq().order()`
      - `prisma.lesson.findUnique({where:{slug}})` → `supabase.from('lessons').select().eq('slug', slug).single()`
      - `prisma.lessonProgress.findMany()` → `supabase.from('lesson_progress').select()`
      - `prisma.siteVisit.create({data})` → `supabase.from('site_visits').insert()`
      - `prisma.lesson.create/update/delete` → `supabase.from('lessons').insert/update/delete`

- [ ] 7. **Update progress.controller.js for Supabase**
      Replace Prisma progress/history calls with Supabase.
      Files:
        - backend/src/controllers/progress.controller.js
      Verify: Server starts without errors.

      **Mapping:**
      - `prisma.lessonProgress.findMany({where:{userId}})` → `supabase.from('lesson_progress').select().eq('user_id', userId)`
      - `prisma.lessonProgress.findUnique({where:{userId_lessonSlug}})` → `supabase.from('lesson_progress').select().eq('user_id', userId).eq('lesson_slug', slug).single()`
      - `prisma.lessonProgress.upsert()` → `supabase.from('lesson_progress').upsert({}, {onConflict: 'user_id,lesson_slug'})`
      - `prisma.watchHistory.upsert()` → `supabase.from('watch_history').upsert()`

- [ ] 8. **Update admin.controller.js for Supabase**
      Replace Prisma admin queries with Supabase, use supabaseAdmin for user management.
      Files:
        - backend/src/controllers/admin.controller.js
      Verify: Server starts without errors.

      **Mapping:**
      - `prisma.user.count()` → `supabase.from('profiles').select('*', {count:'exact', head:true})`
      - `prisma.user.findMany({skip, take})` → `supabase.from('profiles').select().range(skip, skip+take-1)`
      - `prisma.user.delete()` → `supabaseAdmin.auth.admin.deleteUser(userId)`
      - `prisma.$queryRaw` for analytics → `supabase.rpc()` or date functions

- [ ] 9. **Update user.routes.js for Supabase**
      Replace inline Prisma query with Supabase.
      Files:
        - backend/src/routes/user.routes.js
      Verify: Server starts without errors.

- [ ] 10. **Delete obsolete Prisma files and jwt utility**
      Clean up files no longer needed.
      Files to delete:
        - backend/prisma/schema.prisma
        - backend/prisma/seed.js
        - backend/src/utils/jwt.js
        - backend/src/config/database.js (or update to re-export supabase)
      Verify: `npm run dev` still works.

- [ ] 11. **Update frontend dependencies**
      Add @supabase/supabase-js to frontend.
      Files:
        - frontend/package.json
      Verify: `npm install` completes.

- [ ] 12. **Create frontend Supabase client**
      Initialize Supabase client with environment variables.
      Files:
        - frontend/src/lib/supabase.js (new)
        - frontend/.env.example (new)
      Verify: No syntax errors.

- [ ] 13. **Update AuthContext.jsx for Supabase Auth**
      Use Supabase Auth methods instead of fetch to backend auth endpoints.
      Files:
        - frontend/src/context/AuthContext.jsx
      Verify: `npm run dev` starts frontend.

      **Changes:**
      - login(): `supabase.auth.signInWithPassword({email, password})`
      - register(): `supabase.auth.signUp({email, password, options:{data:{name}}})`
      - logout(): `supabase.auth.signOut()`
      - checkAuth: `supabase.auth.getSession()` + `onAuthStateChange()`
      - Store session token for API calls

- [ ] 14. **Update frontend api.js service**
      Get auth token from Supabase session for API requests.
      Files:
        - frontend/src/services/api.js
      Verify: No syntax errors.

---

## Prisma to Supabase Query Reference

| Prisma | Supabase |
|--------|----------|
| `prisma.model.findMany({where, orderBy, take, skip})` | `supabase.from('table').select().eq().order().range()` |
| `prisma.model.findUnique({where:{field}})` | `supabase.from('table').select().eq('field', value).single()` |
| `prisma.model.create({data})` | `supabase.from('table').insert(data).select().single()` |
| `prisma.model.update({where, data})` | `supabase.from('table').update(data).eq().select().single()` |
| `prisma.model.delete({where})` | `supabase.from('table').delete().eq()` |
| `prisma.model.upsert({where, create, update})` | `supabase.from('table').upsert(data, {onConflict: 'field'})` |
| `prisma.model.count({where})` | `supabase.from('table').select('*', {count:'exact', head:true})` |
| `prisma.model.groupBy({by, _count})` | `supabase.rpc('function')` or manual aggregation |

---

## Environment Variables

### Backend (.env)
```
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary (unchanged)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
