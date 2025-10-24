##Database Setup Instructions

This file contains instructions for setting up the database tables and initial data for the ISTE GNDEC website.

### Prerequisites
- Supabase project configured
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables set

### Setup Steps

1. **Access Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor tab

2. **Run the Setup Script**
   - Open `database_setup.sql`
   - Copy the entire content
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the script

3. **Verify Tables Created**
   The script creates the following tables:
   - `projects` - Stores project information
   - `site_settings` - Stores website configuration settings

4. **Initial Data**
   The script also inserts:
   - Two sample projects (IPL Auction 2025 and Luminex 2025)
   - Default navbar setting (Projects link initially hidden)

### Managing Projects in Navbar

To show/hide the Projects link in the navigation bar:
1. Log in to the Admin panel (`/admin`)
2. Navigate to the "Settings" tab
3. Toggle "Show Projects in Navbar"
4. The page will reload and the navbar will update accordingly

### Adding More Projects

Use the Admin panel:
1. Log in to `/admin`
2. Go to the "Projects" tab
3. Click "Add Project"
4. Fill in the project details
5. Upload an image
6. Click "Add Project" to save

### Notes
- All tables use soft deletion (hidden field) instead of hard deletes
- Projects support ordering via the `display_order` field
- The `site_settings` table uses unique keys to prevent duplicate settings
