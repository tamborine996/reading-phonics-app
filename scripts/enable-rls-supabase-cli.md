# Enable RLS Using Supabase CLI

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser to authenticate. You'll get an access token.

## Step 3: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**How to find your project ref:**
- It's in your Supabase URL: `https://YOUR_PROJECT_REF.supabase.co`
- Or run: `supabase projects list` to see all projects

## Step 4: Run the RLS Migration

```bash
supabase db push --dry-run ./supabase-schema.sql
```

Review the changes, then:

```bash
supabase db execute --file ./supabase-schema.sql
```

## Step 5: Verify

```bash
npm run check:rls
```

---

## Troubleshooting

**"Project not found"**
- Make sure you're using the correct project ref
- Run `supabase projects list` to see available projects

**"Permission denied"**
- Ensure you're logged in: `supabase login`
- Check you have admin access to the project
