# 🚀 Deploy Training Ground - Quick Start

## ✅ What's Ready

1. ✅ Reverse Engineering tab REMOVED
2. ✅ Training Ground tab is now #3 in sidebar
3. ✅ Database schema ready (`training-schema.sql`)
4. ✅ Background trainer ready (`background-trainer/index.ts`)
5. ✅ UI ready to show results

---

## 🎯 Deploy Now (3 Commands)

### Step 1: Apply Database Schema

```bash
# Option A: Use Supabase CLI
npx supabase db push

# Option B: Manual (if CLI doesn't work)
# 1. Go to https://supabase.com/dashboard/project/tgoqohbqrcemscrbkbwm/sql/new
# 2. Copy contents of supabase/migrations/training-schema.sql
# 3. Paste and run
```

### Step 2: Set Anthropic API Key (if not done)

```bash
npx supabase secrets set ANTHROPIC_API_KEY=your-key-here
```

### Step 3: Deploy Background Trainer

```bash
npx supabase functions deploy background-trainer
```

---

## ✨ Start Training

1. **Open http://localhost:5173**
2. **Click "Training Ground" tab** (🎓 icon)
3. **Click "Start New Training Batch"**
4. **Wait 5-10 minutes**
5. **Click "Process Batch"**
6. **See results!**

---

## 🎓 What the Agent Does

The background trainer will:

1. **Scrape 50 real employer jobs** from:
   - LinkedIn
   - Indeed
   - Company career pages
   - Greenhouse/Lever

2. **Extract intelligence:**
   - Company names
   - Unique phrases
   - HRIS systems (Workday, etc.)
   - Locations
   - Tech stacks

3. **Store in database:**
   - company_intelligence
   - phrase_intelligence
   - location_intelligence

4. **Show you results** in the Training Ground UI

---

## 💰 Cost

- **First batch (50 jobs):** ~$0.50-1.00
- **Full training (1,000 jobs):** ~$10-15
- **Worth it:** Agent learns to match jobs accurately!

---

## 🔧 Troubleshoot

### "Deploy failed"
```bash
# Login again
npx supabase login

# Link project
npx supabase link --project-ref tgoqohbqrcemscrbkbwm

# Try again
npx supabase functions deploy background-trainer
```

### "Training start failed"
- Check Anthropic API key is set
- Verify API has credits ($5 free)
- Check browser console for errors

---

**Ready? Run the 3 commands above!** 🚀
