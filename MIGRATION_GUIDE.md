# Supabase Migration Guide

This guide will help you complete the migration of your ISTE GNDEC website from static JSON files to Supabase.

## ✅ Completed Steps

1. ✅ Supabase client configuration set up
2. ✅ Admin page created for data management
3. ✅ All pages updated to fetch from Supabase
4. ✅ Database schema created
5. ✅ Supabase credentials added to Replit Secrets

## 📋 Steps to Complete Migration

### Step 1: Create Database Tables in Supabase

1. Go to your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the entire contents of the `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click "Run" to create all the tables

This will create the following tables:
- `events` - Store event information
- `members_faculty` - Faculty advisor information
- `members_core_team` - Core team members
- `members_post_holders` - Post holders
- `gallery` - Gallery images
- `notices` - Notice board items
- `event_highlights` - Past event highlights

### Step 2: Verify Environment Variables

Your Supabase credentials have been added to Replit Secrets. The application will automatically use them.

To verify they're set correctly:
- Go to the "Secrets" tab in Replit (lock icon in the left sidebar)
- Ensure these secrets exist:
  - `VITE_SUPABASE_URL` - Your Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Step 3: Create Admin Account in Supabase

Before you can use the admin panel, you need to create an admin user:

1. Go to your Supabase dashboard
2. Click on "Authentication" in the left sidebar
3. Click "Add user" → "Create new user"
4. Enter an email and password
5. Click "Create user"

### Step 4: Migrate Data from JSON to Supabase

1. Visit the admin page: `/admin` route on your website
2. Login with the credentials you created in Step 3
3. Go to the "Data Migration" tab
4. Click "Start Migration"
5. Wait for the migration to complete

The migration will automatically:
- Read all data from your existing JSON files
- Insert it into the Supabase database
- Show you success/error messages for each table

### Step 5: Test the Application

After migration, test each page to ensure data is loading correctly:

1. **Home Page** - Check the notice board displays correctly
2. **Events Page** - Verify events and highlights are showing
3. **Members Page** - Confirm all team members are displayed
4. **Gallery Page** - Check that gallery images load

## 🔧 Troubleshooting

### Environment Variables Not Working

If you see errors about invalid Supabase URL:

1. Make sure the secrets are named exactly:
   - `VITE_SUPABASE_URL` (not SUPABASE_URL)
   - `VITE_SUPABASE_ANON_KEY` (not SUPABASE_ANON_KEY)

2. Restart the application after adding/updating secrets

### Migration Errors

If the migration fails:

1. Check that all tables were created successfully in Supabase
2. Verify your admin account has the correct permissions
3. Check the browser console for detailed error messages
4. You can run the migration multiple times - it will only insert data that doesn't already exist

### Data Not Displaying

If pages show "No data available":

1. Verify the migration completed successfully
2. Check the Supabase dashboard to confirm data exists in tables
3. Check browser console for API errors
4. Verify Row Level Security policies are set correctly (the SQL script handles this)

## 📊 Database Structure

Each table has:
- Auto-incrementing `id` field
- Data fields matching the original JSON structure
- `created_at` timestamp for tracking
- Row Level Security (RLS) enabled
- Public read access
- Authenticated user write access

## 🎯 Benefits of Supabase Migration

- **Real-time Updates**: Changes reflect immediately without redeploying
- **Scalability**: No more managing JSON files
- **Admin Interface**: Easy content management
- **Security**: Built-in authentication and authorization
- **Backup**: Automatic backups and point-in-time recovery

## 📝 Next Steps

After migration is complete:

1. Remove or archive the old JSON files in `public/data/` (keep as backup)
2. Update content through the admin panel
3. Consider adding image upload functionality
4. Set up email notifications for events
5. Add user registration for events

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Review the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure the database schema was created successfully
