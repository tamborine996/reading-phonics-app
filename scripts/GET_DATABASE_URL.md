# How to Get Your Supabase Database Connection String

## Option A: From Supabase Dashboard (30 seconds)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) in the left sidebar
4. Click **Database**
5. Scroll to **Connection String**
6. Select **URI** tab
7. Copy the connection string

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

⚠️ **IMPORTANT:** Use the **Transaction** mode connection string, NOT Pooler!
- Click "Connection string" → "URI" → Change mode to "Transaction"

## Option B: From Supabase CLI

```bash
supabase projects list
supabase db remote show --project-ref YOUR_PROJECT_REF
```

## Option C: Construct it Manually

If you know your project details:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Replace:
- `[YOUR-PASSWORD]` - Your database password
- `[YOUR-PROJECT-REF]` - Your project reference (from project URL)

---

## Using the Connection String

### Temporary (for one command):

**Windows (Command Prompt):**
```cmd
set SUPABASE_DB_URL=postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres
npm run enable:rls
```

**Windows (PowerShell):**
```powershell
$env:SUPABASE_DB_URL="postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres"
npm run enable:rls
```

**Mac/Linux:**
```bash
SUPABASE_DB_URL="postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres" npm run enable:rls
```

### Permanent (add to .env file):

1. Create/edit `.env` file in project root
2. Add this line:
   ```
   SUPABASE_DB_URL=postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres
   ```
3. Run:
   ```bash
   npm run enable:rls
   ```

---

## Security Notes

⚠️ **NEVER commit .env file to Git**
- It's already in .gitignore
- Contains sensitive passwords

⚠️ **Don't share connection string**
- It has full database access
- Rotate password if accidentally exposed

---

## Troubleshooting

**"connection refused"**
- Check if you're using port 5432 (direct) not 6543 (pooler)
- Use the Transaction mode connection string

**"password authentication failed"**
- Verify password is correct
- Try resetting database password in Supabase dashboard

**"SSL required"**
- The script handles SSL automatically
- Make sure you're using the official Supabase connection string format
