# Supabase CLI Cheat Sheet

## Quick Reference for CLI-First Development

---

## ONE-TIME SETUP

```bash
# Generate access token (web dashboard - once)
# https://supabase.com/dashboard/account/tokens

# Set token permanently
export SUPABASE_ACCESS_TOKEN="sbp_xxx"
# Add to ~/.bashrc or ~/.zshrc to make permanent
```

---

## NEW PROJECT SETUP

```bash
# Method 1: Create project via CLI
npx supabase projects create "my-project"

# Method 2: Link existing project
npx supabase link --project-ref YOUR_PROJECT_REF

# Initialize local config
npx supabase init

# Push initial schema (with RLS!)
npx supabase db push

# Get credentials
npx supabase status
```

---

## DATABASE OPERATIONS

### Migrations

```bash
# Create new migration
npx supabase migration new MIGRATION_NAME

# Push migrations to remote
npx supabase db push

# Generate migration from schema diff
npx supabase db diff -f MIGRATION_NAME

# Reset database (destructive!)
npx supabase db reset
```

### Direct SQL

```bash
# Execute SQL file
npx supabase db execute --file ./schema.sql

# Execute inline SQL
npx supabase db execute -c "SELECT * FROM users LIMIT 5"

# Dump database schema
npx supabase db dump -f schema.sql

# Dump data
npx supabase db dump --data-only -f data.sql
```

### Viewing Data

```bash
# Connect to remote database
npx supabase db remote show

# Get connection string
npx supabase db remote show --connection-string
```

---

## LOCAL DEVELOPMENT

```bash
# Start local Supabase (requires Docker)
npx supabase start

# Stop local Supabase
npx supabase stop

# Restart services
npx supabase stop && npx supabase start

# View local services status
npx supabase status

# View logs
npx supabase logs
```

**Local URLs after `supabase start`:**
- Studio: http://localhost:54323
- API: http://localhost:54321
- DB: postgresql://postgres:postgres@localhost:54322/postgres

---

## PROJECT MANAGEMENT

```bash
# List all projects
npx supabase projects list

# Get project details
npx supabase projects info

# List organizations
npx supabase orgs list
```

---

## FUNCTIONS (Edge Functions)

```bash
# Create new function
npx supabase functions new FUNCTION_NAME

# Deploy function
npx supabase functions deploy FUNCTION_NAME

# Deploy all functions
npx supabase functions deploy

# Serve functions locally
npx supabase functions serve

# View function logs
npx supabase functions logs FUNCTION_NAME
```

---

## STORAGE

```bash
# Create bucket
npx supabase storage create-bucket BUCKET_NAME

# List buckets
npx supabase storage list

# Upload file
npx supabase storage upload BUCKET_NAME/path/to/file.txt ./local-file.txt
```

---

## AUTHENTICATION

```bash
# List users
npx supabase auth users list

# Create user
npx supabase auth users create user@example.com

# Delete user
npx supabase auth users delete USER_ID
```

---

## TESTING & DEBUGGING

```bash
# Run tests
npx supabase test db

# Enable debug mode
npx supabase --debug [command]

# View service logs
npx supabase logs
npx supabase logs --service auth
npx supabase logs --service storage
```

---

## COMMON WORKFLOWS

### Initial Project Setup

```bash
npx supabase init
npx supabase link --project-ref xxx
npx supabase db push
npx supabase status
```

### Schema Change

```bash
npx supabase migration new add_users_table
# Edit migration file
npx supabase db push
```

### Local Development

```bash
npx supabase start
npm run dev
npx supabase stop
```

### Deploy to Production

```bash
npm run type-check
npm run test
npx supabase db push
npm run build
```

---

## ENVIRONMENT VARIABLES

```bash
# Required for CLI operations
export SUPABASE_ACCESS_TOKEN="sbp_xxx"

# Optional: Set default project
export SUPABASE_PROJECT_REF="lgcfmzksdpnolwjwavwt"

# For direct database connection
export SUPABASE_DB_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```

---

## TIPS & TRICKS

### Use .env file

```bash
# .env
SUPABASE_ACCESS_TOKEN=sbp_xxx
SUPABASE_PROJECT_REF=xxx
```

Then: `npx supabase link` (no flags needed!)

### Check connection

```bash
npx supabase db remote show
```

### Quick RLS check

```bash
# From project root
npm run check:rls
```

### Local + Remote sync

```bash
# Pull remote changes to local
npx supabase db pull

# Push local changes to remote
npx supabase db push
```

---

## TROUBLESHOOTING

### "Access token not provided"

```bash
export SUPABASE_ACCESS_TOKEN="sbp_xxx"
# Or add to .env file
```

### "Project not linked"

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### "Database password authentication failed"

- Make sure you're using Transaction mode connection string (port 5432)
- Not Session Pooler mode (port 6543)

### "Docker not running"

```bash
# For local development, start Docker first
docker --version
# Then: npx supabase start
```

### "Migration already exists"

```bash
# Reset and re-apply
npx supabase db reset
npx supabase db push
```

---

## MINIMAL WEB DASHBOARD USAGE

**What you MUST use dashboard for:**
1. Generate access token (once)
2. Create account (once)
3. OAuth provider setup (once per project)

**Everything else: CLI!**

---

## USEFUL LINKS

- CLI Docs: https://supabase.com/docs/guides/cli
- Migrations: https://supabase.com/docs/guides/cli/local-development#database-migrations
- Local Dev: https://supabase.com/docs/guides/cli/local-development
- GitHub: https://github.com/supabase/cli
