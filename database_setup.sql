-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_link TEXT,
  demo_link TEXT,
  status TEXT NOT NULL DEFAULT 'ongoing',
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default navbar setting (initially disabled)
INSERT INTO site_settings (setting_key, setting_value)
VALUES ('show_projects_in_navbar', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert IPL Auction 2025 project
INSERT INTO projects (
  title,
  description,
  image_url,
  technologies,
  github_link,
  demo_link,
  status,
  category,
  featured,
  display_order
) VALUES (
  'IPL Auction 2025 Simulation',
  'An interactive IPL auction simulation platform that brings the excitement of the Indian Premier League player auction to life. This web application features real-time bidding mechanics, team management, budget tracking, and player analytics. Users can experience the thrill of building their dream cricket team through a realistic auction interface with dynamic pricing, player statistics, and strategic team-building tools. Built with modern web technologies to deliver a smooth and engaging user experience.',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vite'],
  NULL,
  'https://ipl-auction-2025.vercel.app/',
  'completed',
  'Web Application',
  true,
  100
);

-- Insert Luminex 2025 project  
INSERT INTO projects (
  title,
  description,
  image_url,
  technologies,
  github_link,
  demo_link,
  status,
  category,
  featured,
  display_order
) VALUES (
  'Luminex 2025',
  'Comprehensive event management platform designed for Luminex 2025, an intra-college technical and cultural fest. This feature-rich web application provides event registration, schedule management, live updates, participant tracking, and real-time notifications. The platform includes dedicated sections for different event categories, team registrations, results publication, and an interactive dashboard for participants. Built to handle concurrent users efficiently with a focus on user experience and performance optimization.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
  NULL,
  'https://luminex-2025.vercel.app/',
  'completed',
  'Web Application',
  true,
  99
);
