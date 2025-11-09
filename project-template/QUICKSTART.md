# Project Template - Quick Start

## What This Is

A **batteries-included** template for new projects with:
- ✅ Supabase setup with RLS enabled from day 1
- ✅ CLI-first workflow (minimal web dashboard usage)
- ✅ Security verification scripts
- ✅ Migration-based schema management

## Prerequisites

1. **Supabase Access Token** (one-time setup)
   - Go to: https://supabase.com/dashboard/account/tokens
   - Generate new token
   - Save it: `export SUPABASE_ACCESS_TOKEN=sbp_xxx`

2. **Node.js 18+**
   - Check: `node --version`

## Setup New Project (5 minutes)

### Method 1: Automated Script (Recommended)

```bash
# 1. Copy this template to new project
cp -r project-template my-new-project
cd my-new-project

# 2. Run setup script
chmod +x scripts/setup-project.sh
./scripts/setup-project.sh

# 3. Follow the prompts
# - Choose to create new project or link existing
# - Script will push schema with RLS enabled

# 4. Copy credentials to .env
cp .env.example .env
# Edit .env with values from setup output

# 5. Verify RLS is working
npm install
npm run check:rls

# 6. Start developing!
npm run dev
```

### Method 2: Manual Step-by-Step

```bash
# 1. Initialize Supabase
npx supabase init

# 2. Create new project (or link existing)
npx supabase projects create "my-project"
# OR
npx supabase link --project-ref xxx-yyy-zzz

# 3. Customize schema
# Edit: supabase/migrations/00000000000000_initial_schema.sql

# 4. Push to Supabase
npx supabase db push

# 5. Get credentials
npx supabase status

# 6. Create .env from .env.example
cp .env.example .env
# Fill in values from step 5

# 7. Verify
npm run check:rls
```

## Project Structure

```
my-new-project/
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 00000000000000_initial_schema.sql  # ← RLS included!
├── scripts/
│   ├── setup-project.sh       # Automated setup
│   └── verify-rls.ts          # Security check
├── .env.example               # Template for credentials
├── .gitignore
└── package.json
```

## Customizing for Your Project

### 1. Update Database Schema

Edit `supabase/migrations/00000000000000_initial_schema.sql`:

```sql
-- Replace user_data table with your tables
CREATE TABLE IF NOT EXISTS your_table (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Add your columns here
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keep RLS policies! Just change table name
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id);

-- ... etc
```

### 2. Push Changes

```bash
npx supabase db push
```

### 3. Verify RLS Still Works

```bash
npm run check:rls
```

## Available Scripts

```bash
# Development
npm run dev                    # Start dev server

# Database
npm run db:migrate            # Push migrations to Supabase
npm run db:reset              # Reset database (local)
npm run db:diff               # Generate migration from changes
npm run db:local              # Start local Supabase
npm run db:local:stop         # Stop local Supabase

# Security
npm run check:rls             # Verify RLS is enabled

# Testing
npm test                      # Run tests
npm run type-check            # TypeScript validation
```

## Creating Migrations

When you need to change the schema:

```bash
# 1. Generate migration file
npx supabase migration new add_new_feature

# 2. Edit the generated file
# supabase/migrations/XXXXXX_add_new_feature.sql

# 3. Always include RLS for new tables!
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

# 4. Push to Supabase
npx supabase db push
```

## OAuth Setup (If Needed)

If your project uses Google/GitHub OAuth:

**One-time (per project) - requires web dashboard:**

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google (or other provider)
3. Add OAuth client ID and secret
4. Add redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

**That's the ONLY time you need the dashboard for auth!**

## Local Development

```bash
# Start local Supabase (requires Docker)
npm run db:local

# This starts:
# - PostgreSQL database (localhost:54322)
# - Studio UI (http://localhost:54323)
# - Auth server
# - Storage server

# Develop locally (no cloud costs!)
npm run dev

# Stop when done
npm run db:local:stop
```

## FAQ

**Q: Do I need to visit the web dashboard?**
A: Only for:
- Creating Supabase account (once)
- Generating access token (once)
- OAuth provider setup (once per project, if needed)

Everything else is CLI!

**Q: How do I know RLS is working?**
A: Run `npm run check:rls` - it will tell you.

**Q: Can I use this template for ALL my projects?**
A: Yes! Copy the `project-template/` folder for each new project.

**Q: What if I forget to enable RLS?**
A: You can't! It's in the initial migration that runs automatically.

**Q: How do I add more tables?**
A: Create a new migration:
```bash
npx supabase migration new add_products_table
# Edit the file, include RLS policies
npx supabase db push
```

## Security Checklist

Before going to production:

- [ ] RLS enabled on all tables (`npm run check:rls`)
- [ ] All tables have appropriate policies
- [ ] Environment variables are in `.env` (not committed)
- [ ] `.gitignore` includes `.env`
- [ ] OAuth redirects configured correctly

## Support

See full documentation: `docs/FUTURE_PROJECT_SETUP.md`
