# Admin Panel New Features Guide

## 🎯 Overview

The admin panel now includes powerful features to manage your team members more effectively:

1. **Search functionality** - Quickly find members by name or position
2. **Hide/Show toggle** - Hide members from public view while keeping their data
3. **Reorder members** - Change the display order on the website
4. **Scrollable edit dialogs** - Better UX for long forms
5. **Social media links for Faculty** - LinkedIn, GitHub, Instagram for faculty advisors

---

## ⚠️ REQUIRED: Database Setup

### Step 1: Run SQL for Social Media (if not already done)

```sql
-- Add social media columns
ALTER TABLE members_faculty
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT;
```

### Step 2: Run SQL for Hide/Show and Ordering Features

**IMPORTANT: You MUST run this SQL in your Supabase dashboard before using the new features!**

```sql
-- Add hidden and display_order columns to all member tables

-- Faculty table
ALTER TABLE members_faculty 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Core Team table
ALTER TABLE members_core_team 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Post Holders table
ALTER TABLE members_post_holders 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Executive Team table
ALTER TABLE members_executive 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial display_order for existing members
UPDATE members_faculty SET display_order = id WHERE display_order = 0;
UPDATE members_core_team SET display_order = id WHERE display_order = 0;
UPDATE members_post_holders SET display_order = id WHERE display_order = 0;
UPDATE members_executive SET display_order = id WHERE display_order = 0;
```

---

## 🔍 Feature 1: Search

**How to use:**
- Type in the search box at the top of each member section
- Search filters by name or position
- Results update in real-time as you type

**Example:**
- Search "President" to find all members with "President" in their position
- Search "John" to find all members named John

---

## 👁️ Feature 2: Hide/Show Members

**What it does:**
- Hidden members are stored in the database but NOT shown on the public website
- Useful for:
  - Inactive members you want to keep on record
  - Members on leave
  - Past members you don't want to delete

**How to use:**
1. In the admin panel, find the member you want to hide
2. Click the **Eye icon** (👁️) button
3. The member will be hidden from the website
4. Click the **Eye-Off icon** (🚫👁️) to show them again

**Status indicators:**
- 👁️ (Eye icon) = Member is currently **visible** on website → Click to **hide**
- 🚫👁️ (Eye-off icon) = Member is currently **hidden** from website → Click to **show**

---

## ↕️ Feature 3: Reorder Members

**What it does:**
- Change the order members appear on the public website
- Members are displayed in order from lowest to highest `display_order` number

**How to use:**
1. Find the member you want to move
2. Click ⬆️ (Up arrow) to move them earlier in the list
3. Click ⬇️ (Down arrow) to move them later in the list
4. The website will immediately reflect the new order

**Example:**
If you want the President to appear first:
1. Keep clicking ⬆️ on the President's row until they're at position 1

---

## 📜 Feature 4: Scrollable Edit Dialogs

**What changed:**
- Edit forms (especially Faculty) are now scrollable
- Long forms won't overflow the screen
- Better experience on smaller screens

**Applies to:**
- Faculty edit dialog
- All member edit dialogs with social media fields

---

## 🔗 Feature 5: Social Media for Faculty

**What's new:**
- Faculty advisors can now have social media links (just like other members)
- Optional fields: LinkedIn, GitHub, Instagram
- Icons only appear on website when links are provided

**How to add:**
1. Edit a faculty member
2. Scroll down to find social media fields
3. Add LinkedIn, GitHub, or Instagram URLs (optional)
4. Save

---

## 🎨 How Features Work Together

**Example workflow:**

1. **Add a new team member**
   - Add all their details including social media links
   - They appear at the end of the list
   
2. **Reorder them**
   - Use ⬆️ buttons to move them to the correct position
   
3. **Temporarily hide them**
   - Member goes on leave → Click 👁️ to hide
   - They come back → Click 🚫👁️ to show
   
4. **Search for them later**
   - Type their name in the search box
   - Edit or update as needed

---

## 📊 Technical Details

### Database Schema Changes

Each member table now has:
- `hidden` (BOOLEAN) - Controls visibility on website
- `display_order` (INTEGER) - Controls display order (lower = earlier)
- `linkedin` (TEXT) - LinkedIn profile URL
- `github` (TEXT) - GitHub profile URL  
- `instagram` (TEXT) - Instagram profile URL

### Website Behavior

The public Members page will:
- Filter out all members where `hidden = true`
- Sort members by `display_order` (ascending)
- Only show social media icons when URLs are provided

---

## ✅ Checklist

Before using the new features:

- [ ] Run the SQL script for social media columns
- [ ] Run the SQL script for hidden and display_order columns
- [ ] Verify columns exist in Supabase Table Editor
- [ ] Test search functionality
- [ ] Test hide/show toggle
- [ ] Test reordering with up/down buttons
- [ ] Add social media links to a faculty member
- [ ] Verify hidden members don't appear on website

---

## 🆘 Troubleshooting

**"Column does not exist" errors**
- You need to run the SQL scripts in Supabase first
- Check Supabase Table Editor to confirm columns exist

**Search not working**
- Make sure you're typing in the search box
- Search is case-insensitive

**Reorder buttons not working**
- Make sure you ran the SQL to add `display_order` column
- Check browser console for errors

**Hidden members still showing on website**
- Clear your browser cache
- Verify the member has `hidden = true` in Supabase
- Check the Members page code is filtering correctly

---

## 🎯 Summary

All admin tables now have:
- ✅ Search box to filter members
- ✅ Hide/Show toggle (Eye icons)
- ✅ Reorder buttons (Up/Down arrows)
- ✅ Scrollable edit dialogs
- ✅ Social media link support (Faculty included)

Members page automatically:
- ✅ Hides members marked as hidden
- ✅ Displays members in order by display_order
- ✅ Shows social media icons when links provided
