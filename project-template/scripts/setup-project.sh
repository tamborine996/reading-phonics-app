#!/bin/bash
# One-command setup for new Supabase projects
# Usage: ./scripts/setup-project.sh

set -e

echo "🚀 Setting up new Supabase project..."
echo ""

# Check for access token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ SUPABASE_ACCESS_TOKEN not found in environment"
  echo ""
  echo "Please set it first:"
  echo "  export SUPABASE_ACCESS_TOKEN=sbp_your_token_here"
  echo ""
  echo "Or add to .env file:"
  echo "  echo 'SUPABASE_ACCESS_TOKEN=sbp_xxx' >> .env"
  echo ""
  exit 1
fi

# Initialize Supabase config
echo "📝 Initializing Supabase configuration..."
npx supabase init

# Ask for project ref or create new
echo ""
echo "Do you want to:"
echo "  1) Link to existing Supabase project"
echo "  2) Create new Supabase project"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
  read -p "Enter your project ref: " PROJECT_REF
  echo "🔗 Linking to project $PROJECT_REF..."
  npx supabase link --project-ref $PROJECT_REF
elif [ "$choice" = "2" ]; then
  read -p "Enter project name: " PROJECT_NAME
  echo "🆕 Creating new project: $PROJECT_NAME..."
  npx supabase projects create "$PROJECT_NAME"
  echo "✅ Project created! Copy the project ref from above."
else
  echo "❌ Invalid choice"
  exit 1
fi

# Push database schema with RLS
echo ""
echo "📤 Pushing database schema (includes RLS policies)..."
npx supabase db push

# Get project credentials
echo ""
echo "🔑 Getting project credentials..."
npx supabase status

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Setup complete!"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Copy credentials above to .env file"
echo "  2. npm install"
echo "  3. npm run check:rls (verify security)"
echo "  4. npm run dev"
echo ""
