# Supabase Database Setup Guide

## Overview
This document provides instructions for setting up the complete database schema for the ISTE GNDEC Student Chapter website.

## Quick Setup

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Create a new query

2. **Run the Schema**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify Setup**
   - Check that all 8 tables are created:
     - `events`
     - `event_highlights`
     - `gallery`
     - `notices`
     - `members_faculty`
     - `members_core_team`
     - `members_post_holders`
     - `members_executive`

## Table Structures

### Events Table
Stores upcoming and past events with full details including agenda, capacity, and organizer information.

**Key Fields:**
- `title`, `date`, `time`, `location`, `description`
- `status` (UPCOMING/COMPLETED)
- `agenda` (text array)
- `hidden` (visibility control)
- `display_order` (custom sorting)

### Event Highlights Table
Featured past events with posters and Instagram links.

**Key Fields:**
- `title`, `date`, `location`, `description`
- `poster` (image URL)
- `instagram_link`
- `highlights` (text array)

### Gallery Table
Image collections organized by category.

**Key Fields:**
- `title`, `category`, `description`
- `images` (text array - supports multiple images)
- `hidden`, `display_order`

### Notices Table
Announcements and notifications.

**Key Fields:**
- `title`, `date`, `time`, `description`
- `type` (EVENT/ANNOUNCEMENT/etc)
- `status` (UPCOMING/COMPLETED)

### Members Tables (4 tables)

#### Faculty Table (`members_faculty`)
- `name`, `title`, `image`, `description`
- Social links: `linkedin`, `github`, `instagram` (all optional)

#### Core Team Table (`members_core_team`)
- `name`, `position`, `image`
- `email` (optional)
- Social links (optional)

#### Post Holders Table (`members_post_holders`)
- Same structure as Core Team

#### Executive Team Table (`members_executive`)
- Same structure as Core Team

## Features

### Security
✅ Row Level Security (RLS) enabled on all tables
✅ Public read access for website visitors
✅ Full CRUD access for admin operations

### Performance
✅ Indexes on `display_order` columns
✅ Indexes on `status` and `category` fields
✅ Optimized for fast queries

### Flexibility
✅ Optional email field for members
✅ Hidden field for soft deletion
✅ Custom display ordering
✅ Support for multiple images in gallery
✅ Text arrays for agendas and highlights

## Common Operations

### Hide an Item
```sql
UPDATE events SET hidden = true WHERE id = 1;
```

### Reorder Items
```sql
UPDATE events SET display_order = 5 WHERE id = 1;
```

### Add a Member (without email)
```sql
INSERT INTO members_core_team (name, position, image)
VALUES ('John Doe', 'President', '/images/john.jpg');
```

## Troubleshooting

### Issue: Policies Not Working
**Solution:** Make sure RLS is enabled:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Issue: Cannot Insert Data
**Solution:** Check if policies exist:
```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

### Issue: Images Not Loading
**Solution:** 
- Ensure image URLs are complete (https://...)
- Use Supabase Storage URLs when possible
- Default avatar available at `/default-avatar.png`

## Environment Variables

Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Schema Updates

This schema is current as of **October 2025**.

### Recent Changes:
- ✅ Email made optional for all member tables
- ✅ Gallery supports multiple images (text array)
- ✅ Added performance indexes
- ✅ Updated RLS policies for better security

## Support

For issues or questions:
1. Check the Supabase documentation
2. Review the `supabase-schema.sql` file
3. Contact the development team

---

**Website:** https://iste-gndec.vercel.app/
**Last Updated:** October 24, 2025
