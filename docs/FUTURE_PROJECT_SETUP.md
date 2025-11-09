# Future Project Setup - Supabase + Claude Code

## The Goal
Set up new projects using **99% CLI**, visiting Supabase web dashboard **only when absolutely necessary**.

---

## ONE-TIME SETUP (Do This Once, Use Forever)

These steps are done **once per Supabase account**, not per project.

### Step 1: Create Supabase Account (Web - 2 minutes)
- Go to https://supabase.com
- Sign up (if you don't have an account)
- **Done - never need to do this again**

### Step 2: Generate Permanent Access Token (Web - 1 minute)
1. Go to https://supabase.com/dashboard/account/tokens
2. Click **"Generate New Token"**
3. Name: "CLI Permanent Access"
4. **Copy the token** (e.g., `sbp_1c6689e96dc992dc51a5d8676f67c8610cf5ad47`)
5. **SAVE IT PERMANENTLY** (see below)

### Step 3: Store Token Permanently (CLI - 30 seconds)

**Option A: Global Environment Variable (Recommended)**

**Windows (PowerShell - add to profile):**
```powershell
# Edit your PowerShell profile
notepad $PROFILE

# Add this line:
$env:SUPABASE_ACCESS_TOKEN="sbp_your_token_here"
```

**Windows (System Environment Variables):**
1. Search "Environment Variables" in Windows
2. Click "Environment Variables"
3. Under "User variables", click "New"
4. Variable name: `SUPABASE_ACCESS_TOKEN`
5. Variable value: `sbp_your_token_here`

**Mac/Linux (add to ~/.bashrc or ~/.zshrc):**
```bash
echo 'export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

**Option B: Project-Specific .env (Per Project)**
```bash
# In each project root
echo 'SUPABASE_ACCESS_TOKEN=sbp_your_token_here' >> .env
```

---

## EVERY NEW PROJECT SETUP (CLI-First Workflow)

Now that you have the token saved, here's the workflow for **every new project**.

### Project Initialization (100% CLI)

#### Option A: Create New Supabase Project via CLI

```bash
# Create new project from CLI
npx supabase projects create "my-new-project" --org-id YOUR_ORG_ID

# Get your org ID (one-time lookup):
npx supabase orgs list
```

**Note:** This creates the Supabase project WITHOUT visiting the dashboard!

#### Option B: Create Project via Web, Then Link via CLI

If CLI project creation doesn't work or you prefer web:

1. **Web (30 seconds):** Create project at https://supabase.com/dashboard
2. **CLI:** Link it immediately:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

---

### Database Schema Setup (100% CLI)

**Step 1: Initialize Supabase in Your Project**

```bash
# In your project directory
npx supabase init
```

This creates:
```
supabase/
├── config.toml          # Supabase configuration
├── seed.sql             # Seed data
└── migrations/          # Database migrations
    └── YYYYMMDDHHMMSS_initial_schema.sql
```

**Step 2: Create Initial Migration with RLS Built-In**

```bash
# Generate migration file
npx supabase migration new initial_schema
```

Edit `supabase/migrations/XXXXXX_initial_schema.sql`:

```sql
-- Your table schema
CREATE TABLE IF NOT EXISTS your_table (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS from day 1
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create RLS policies immediately
CREATE POLICY "Users can view own data"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON your_table FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON your_table FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON your_table FOR DELETE
  USING (auth.uid() = user_id);
```

**Step 3: Push Migration to Supabase**

```bash
# Apply migration to remote database
npx supabase db push
```

**Done!** RLS is enabled from the start. No dashboard needed.

---

### Get Project Credentials (CLI)

```bash
# Get your project URL and anon key
npx supabase status

# Or get connection string for direct database access
npx supabase db remote show
```

Save to `.env`:
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Local Development (100% CLI)

```bash
# Start local Supabase (Docker required)
npx supabase start

# This gives you:
# - Local Postgres database
# - Local Auth server
# - Local Storage
# - Local Realtime
# - Studio UI at http://localhost:54323

# Stop when done
npx supabase stop
```

**Benefits:**
- Develop offline
- No cloud costs during development
- Fast iteration
- Exact production environment

---

## PROJECT TEMPLATE (Copy This for Every New Project)

Create a template directory you can copy for all projects:

### File Structure
```
my-project-template/
├── supabase/
│   ├── migrations/
│   │   └── 00000000000000_initial_schema.sql
│   └── config.toml
├── scripts/
│   ├── setup-supabase.sh
│   └── verify-rls.ts
├── .env.example
├── .gitignore
└── package.json
```

### `scripts/setup-supabase.sh`

```bash
#!/bin/bash
# One-command Supabase setup for new projects

set -e

echo "🚀 Setting up Supabase for new project..."

# Check if SUPABASE_ACCESS_TOKEN is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ SUPABASE_ACCESS_TOKEN not set!"
  echo "Run: export SUPABASE_ACCESS_TOKEN=your_token"
  exit 1
fi

# Initialize Supabase
npx supabase init

# Link to project (or create new one)
echo "Enter your project ref (or press enter to create new):"
read PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
  echo "Creating new Supabase project..."
  npx supabase projects create "my-new-project"
else
  echo "Linking to existing project..."
  npx supabase link --project-ref $PROJECT_REF
fi

# Push migrations (includes RLS)
echo "Pushing database schema with RLS..."
npx supabase db push

# Get credentials
echo "Getting project credentials..."
npx supabase status > .env.local

echo "✅ Setup complete!"
echo "Next steps:"
echo "  1. Copy credentials from .env.local to .env"
echo "  2. npm install"
echo "  3. npm run dev"
```

### `supabase/migrations/00000000000000_initial_schema.sql`

```sql
-- Template migration with RLS built-in
-- Customize this for your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Example table with RLS
CREATE TABLE IF NOT EXISTS user_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON user_data FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### `.env.example`

```bash
# Supabase credentials (get from: npx supabase status)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# For CLI operations
SUPABASE_ACCESS_TOKEN=sbp_your_token_here

# For direct database access (if needed)
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "db:migrate": "npx supabase db push",
    "db:reset": "npx supabase db reset",
    "db:diff": "npx supabase db diff",
    "db:local": "npx supabase start",
    "db:local:stop": "npx supabase stop",
    "check:rls": "tsx scripts/verify-rls.ts"
  }
}
```

---

## MINIMAL WEB DASHBOARD USAGE CHECKLIST

Here's **exactly** what you need from the web dashboard (and nothing more):

### Initial Setup (Once Per Account)
- [ ] Create Supabase account
- [ ] Generate access token
- [ ] Get organization ID: `npx supabase orgs list`

### Per Project Setup (If OAuth Needed)
- [ ] Configure Google OAuth provider (Settings → Authentication → Providers)
  - Add authorized redirect URL
  - Add OAuth client ID/secret

**That's it!** Everything else can be done via CLI.

---

## CLAUDE CODE WORKFLOW

When working with Claude Code on future projects:

### What Claude Code Knows Automatically
- ✅ Your project files
- ✅ Environment variables from `.env`
- ✅ Git repository state

### What Claude Code DOESN'T Know (You Need to Provide)
- ❌ Your Supabase access token (unless in environment)
- ❌ Your project ref (until you tell it)
- ❌ Your Supabase account details

### How to Give Claude Code What It Needs

**Method 1: Environment Variables (Best)**
```bash
# Set these in your shell profile or system environment
export SUPABASE_ACCESS_TOKEN="sbp_xxx"
export SUPABASE_PROJECT_REF="lgcfmzksdpnolwjwavwt"
```

Then Claude Code can run:
```bash
npx supabase link --project-ref $SUPABASE_PROJECT_REF
npx supabase db push
```

**Method 2: Tell Claude Once**
When starting a session, just say:
> "My Supabase project ref is `lgcfmzksdpnolwjwavwt` and my access token is in the environment variable SUPABASE_ACCESS_TOKEN"

Claude Code will remember for that session and use it.

**Method 3: Store in Project .env**
```bash
# .env file (gitignored)
SUPABASE_ACCESS_TOKEN=sbp_xxx
SUPABASE_PROJECT_REF=lgcfmzksdpnolwjwavwt
```

Claude Code can read this and use it automatically.

---

## AVOIDING THE RLS RIGMAROLE

The issue we encountered was:
1. ❌ Schema file existed but was never run
2. ❌ RLS documented but not enabled
3. ❌ No verification that RLS was working

**How to avoid this in future:**

### 1. Use Supabase Migrations from Day 1

```bash
# Initialize with migrations
npx supabase init

# Create initial schema WITH RLS
npx supabase migration new initial_schema

# Edit migration file to include RLS
# Then push it
npx supabase db push
```

This ensures the migration is **actually run**, not just documented.

### 2. Add RLS Verification to CI/CD

In your `package.json`:
```json
{
  "scripts": {
    "test:security": "tsx scripts/verify-rls.ts",
    "deploy": "npm run test:security && npm run build"
  }
}
```

Now every deployment **verifies RLS** is enabled.

### 3. Use the Template

Copy the template above for every project. It includes:
- ✅ RLS policies in migration
- ✅ Verification scripts
- ✅ Setup automation

---

## COMPLETE NEW PROJECT WORKFLOW (5 Minutes)

Here's the **actual step-by-step** for a brand new project:

```bash
# 1. Copy template
cp -r ~/my-project-template ~/new-awesome-project
cd ~/new-awesome-project

# 2. Create Supabase project (CLI or web)
npx supabase projects create "awesome-project"  # CLI way
# OR create via web and copy project ref

# 3. Link project
npx supabase link --project-ref xxx-yyy-zzz

# 4. Customize your schema
# Edit supabase/migrations/00000000000000_initial_schema.sql
# Add your tables, keeping RLS policies

# 5. Push to Supabase
npx supabase db push

# 6. Get credentials
npx supabase status

# Copy output to .env:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# 7. Verify RLS is working
npm run check:rls

# 8. Start developing
npm run dev
```

**Done!** RLS enabled from the start, no dashboard needed except initial project creation.

---

## TL;DR - ABSOLUTE MINIMUM WEB DASHBOARD USAGE

### One-Time (Per Account):
1. Create account: https://supabase.com
2. Generate token: https://supabase.com/dashboard/account/tokens
3. Save token to environment variable

### Per Project (Optional - can use CLI):
1. Create project (or use `npx supabase projects create`)
2. Setup OAuth providers (if using Google/GitHub auth)

### Never Need Dashboard For:
- ❌ Database schema
- ❌ RLS policies
- ❌ Migrations
- ❌ Viewing data (use CLI: `npx supabase db dump`)
- ❌ Functions
- ❌ Storage buckets
- ❌ Monitoring (use CLI: `npx supabase logs`)

---

## QUESTIONS?

Ask me anything about:
- Setting up the template
- Automating more steps
- Creating a custom boilerplate
- Integrating with Claude Code workflows
- Anything else!

**Goal:** Visit Supabase web dashboard < 2 minutes per project.
