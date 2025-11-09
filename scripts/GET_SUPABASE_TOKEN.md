# Get Supabase Access Token for CLI

Since we're running in a non-interactive environment, we need an access token.

## Method 1: Generate Access Token (2 minutes)

1. Go to https://supabase.com/dashboard/account/tokens
2. Click **"Generate New Token"**
3. Give it a name (e.g., "CLI Access")
4. Click **"Generate Token"**
5. Copy the token immediately (it won't show again)

## Method 2: Use Existing Token

If you already have a Supabase access token, use that.

---

## Using the Token

Once you have the token, run:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF --token YOUR_ACCESS_TOKEN
npx supabase db execute --file ./supabase-schema.sql --token YOUR_ACCESS_TOKEN
```

Or set it as an environment variable:

**Windows PowerShell:**
```powershell
$env:SUPABASE_ACCESS_TOKEN="your_token_here"
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db execute --file ./supabase-schema.sql
```

**Windows Command Prompt:**
```cmd
set SUPABASE_ACCESS_TOKEN=your_token_here
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db execute --file ./supabase-schema.sql
```

---

## Easier Alternative: Direct Database Method

Since the CLI requires browser access anyway, it might be faster to use the direct database connection method:

```bash
npm run enable:rls
```

You just need the database connection string (see GET_DATABASE_URL.md).
