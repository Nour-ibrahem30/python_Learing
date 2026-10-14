# 🐍 بايثون مع نوار - Backend API

Backend API for the Python with Nawar learning platform.

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + bcrypt
- **Video:** Cloudinary

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Setup environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Setup database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/profile` | Update profile |
| PATCH | `/api/auth/password` | Change password |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Get user progress |
| GET | `/api/progress/:lessonSlug` | Get lesson progress |
| PATCH | `/api/progress/:lessonSlug` | Update progress |
| POST | `/api/progress/:lessonSlug/complete` | Mark as completed |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons` | Get all lessons |
| GET | `/api/lessons/:slug` | Get single lesson |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/analytics` | Analytics data |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/users/:id` | User details |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

## Database Commands

```bash
# Open Prisma Studio (GUI)
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npx prisma db push --force-reset
```

## Default Admin

After seeding:
- Email: `admin@pythonwithnawar.com`
- Password: `admin123`

⚠️ Change this password in production!
