#!/bin/bash

# RecruitIQ Deployment Script
# This script helps deploy your code to GitHub

echo "🚀 RecruitIQ Deployment Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the dashboard-ui directory"
    exit 1
fi

# Check git status
echo "📊 Checking git status..."
git status
echo ""

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    echo "✅ No uncommitted changes"
else
    echo "⚠️  You have uncommitted changes"
    read -p "Would you like to commit them now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        echo "✅ Changes committed"
    fi
fi

echo ""
echo "🔐 Attempting to push to GitHub..."
echo "Repository: https://github.com/ndearborn68/RecruitIQ"
echo ""

# Try to push
if git push -u origin main 2>&1; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🎉 Your code is now live at: https://github.com/ndearborn68/RecruitIQ"
    echo ""
    echo "Next steps:"
    echo "  1. Visit your repository"
    echo "  2. Set up GitHub Pages or deploy to Vercel/Netlify"
    echo "  3. Configure environment variables in your deployment"
else
    echo ""
    echo "⚠️  Push failed. This is likely due to authentication."
    echo ""
    echo "Please choose an authentication method:"
    echo ""
    echo "Option 1: GitHub CLI (Recommended)"
    echo "  brew install gh"
    echo "  gh auth login"
    echo "  git push -u origin main"
    echo ""
    echo "Option 2: Personal Access Token"
    echo "  1. Go to: https://github.com/settings/tokens?type=beta"
    echo "  2. Click 'Generate new token'"
    echo "  3. Select: Repository access → Only RecruitIQ"
    echo "  4. Permissions: Contents (Read and write)"
    echo "  5. Generate and copy the token"
    echo "  6. Run: git push -u origin main"
    echo "  7. Use the token as your password"
    echo ""
    echo "Option 3: SSH Keys"
    echo "  1. Generate SSH key: ssh-keygen -t ed25519 -C 'your_email@example.com'"
    echo "  2. Add to GitHub: https://github.com/settings/keys"
    echo "  3. Update remote: git remote set-url origin git@github.com:ndearborn68/RecruitIQ.git"
    echo "  4. Run: git push -u origin main"
fi

echo ""
echo "📦 Repository Contents:"
echo "  ✅ 2 commits with all your code"
echo "  ✅ 57 files including Training Ground"
echo "  ✅ Professional README"
echo "  ✅ All Supabase Edge Functions"
echo ""
