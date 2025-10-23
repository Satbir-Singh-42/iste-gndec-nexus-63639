# Social Media Links Setup Guide

## Overview

Social media icons (Email, LinkedIn, GitHub, Instagram) have been added to the Members page. Icons will only display when the corresponding link is provided.

---

## ⚠️ IMPORTANT: Database Update Required

Before the social media links work, you **MUST** add new columns to your Supabase database.

### Step 1: Run SQL in Supabase

1. Go to your Supabase dashboard at [supabase.com](https://supabase.com)
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of the `add-social-media-columns.sql` file
5. Paste it into the SQL editor
6. Click **Run** to add the columns

**SQL to run:**
```sql
ALTER TABLE members_core_team 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_post_holders 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE members_executive 
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;
```

---

## ✨ What's New

### Members Page

Each member card now displays social media icons that link to:
- 📧 **Email** (mailto link)
- 💼 **LinkedIn** (opens in new tab)
- 💻 **GitHub** (opens in new tab)
- 📸 **Instagram** (opens in new tab)

**Icons only appear when a link is provided** - if you don't add a LinkedIn URL, the LinkedIn icon won't show!

### Admin Panel

When adding or editing members, you now have these optional fields:

- **LinkedIn URL** (optional)
  - Example: `https://linkedin.com/in/username`
  
- **GitHub URL** (optional)
  - Example: `https://github.com/username`
  
- **Instagram URL** (optional)
  - Example: `https://instagram.com/username`

**All social media fields are optional** - you can skip them if not needed.

---

## 📝 How to Use

### Adding a New Member with Social Links

1. Go to `/admin` and login
2. Navigate to the **Members** tab
3. Click **Add Member** for any team category
4. Fill in the required fields (Name, Position, Email, Image)
5. Optionally fill in social media URLs:
   - LinkedIn URL
   - GitHub URL
   - Instagram URL
6. Click **Add Member**

### Editing Existing Members

1. Go to `/admin` → **Members** tab
2. Click the **Edit** button (pencil icon) for any member
3. Add or update social media URLs
4. Click **Update Member**

### URL Format

Make sure to use full URLs:
- ✅ Correct: `https://linkedin.com/in/johndoe`
- ❌ Wrong: `linkedin.com/in/johndoe`
- ❌ Wrong: `johndoe`

---

## 🎨 Display Behavior

On the Members page:

**With all social links:**
```
[Email] [LinkedIn] [GitHub] [Instagram]
```

**With only email and LinkedIn:**
```
[Email] [LinkedIn]
```

**With only email:**
```
[Email]
```

The icons automatically adjust based on what's available!

---

## 🔧 Technical Details

### Database Schema

New columns added to:
- `members_core_team`
- `members_post_holders`
- `members_executive`

Each table now has:
- `linkedin` (TEXT, nullable)
- `github` (TEXT, nullable)
- `instagram` (TEXT, nullable)

### Icons Used

- Email: `Mail` icon from lucide-react
- LinkedIn: `Linkedin` icon from lucide-react
- GitHub: `Github` icon from lucide-react
- Instagram: `Instagram` icon from lucide-react

---

## ✅ Checklist

- [ ] Run the SQL script in Supabase SQL Editor
- [ ] Verify columns were added (check Table Editor in Supabase)
- [ ] Test adding a new member with social links
- [ ] Check that icons appear on the Members page
- [ ] Test that clicking icons opens the correct links

---

## 🆘 Troubleshooting

**Problem: Icons not showing**
- Make sure you ran the SQL script in Supabase
- Refresh your browser after adding/updating members
- Check that URLs are complete (include `https://`)

**Problem: "Column does not exist" error**
- You need to run the SQL script in Supabase first
- Verify in Supabase Table Editor that the columns exist

**Problem: Links not opening**
- Ensure URLs start with `https://` or `http://`
- Check for typos in the URLs

---

## 🎉 You're All Set!

After running the SQL script, you can start adding social media links to your team members. Icons will appear automatically on the Members page when links are provided!
