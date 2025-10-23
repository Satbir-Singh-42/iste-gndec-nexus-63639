import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (!supabase) {
      setCheckingAuth(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      toast.error("Supabase is not configured. Please check your environment variables.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  const handleDataMigration = async () => {
    if (!supabase) {
      toast.error("Supabase is not configured. Please check your environment variables.");
      return;
    }

    try {
      toast.info("Starting data migration from JSON to Supabase...");

      const eventsResponse = await fetch("/data/events.json");
      const events = await eventsResponse.json();
      
      const membersResponse = await fetch("/data/members.json");
      const members = await membersResponse.json();
      
      const galleryResponse = await fetch("/data/gallery.json");
      const gallery = await galleryResponse.json();
      
      const noticesResponse = await fetch("/data/notices.json");
      const notices = await noticesResponse.json();
      
      const highlightsResponse = await fetch("/data/event-highlights.json");
      const highlights = await highlightsResponse.json();

      const { count: existingEventsCount } = await supabase
        .from("events")
        .select('*', { count: 'exact', head: true });

      if (existingEventsCount === 0) {
        const { error: eventsError } = await supabase.from("events").insert(events);
        if (eventsError) throw new Error(`Events: ${eventsError.message}`);
        toast.success("Events migrated successfully");
      } else {
        toast.info("Events already exist, skipping...");
      }

      const { count: existingFacultyCount } = await supabase
        .from("members_faculty")
        .select('*', { count: 'exact', head: true });

      if (existingFacultyCount === 0 && members.faculty) {
        const { error: facultyError } = await supabase.from("members_faculty").insert([members.faculty]);
        if (facultyError) throw new Error(`Faculty: ${facultyError.message}`);
        toast.success("Faculty migrated successfully");
      } else {
        toast.info("Faculty already exists, skipping...");
      }

      const { count: existingCoreCount } = await supabase
        .from("members_core_team")
        .select('*', { count: 'exact', head: true });

      if (existingCoreCount === 0 && members.coreTeam?.length > 0) {
        const { error: coreError } = await supabase.from("members_core_team").insert(members.coreTeam);
        if (coreError) throw new Error(`Core Team: ${coreError.message}`);
        toast.success("Core team migrated successfully");
      } else {
        toast.info("Core team already exists, skipping...");
      }

      const { count: existingPostCount } = await supabase
        .from("members_post_holders")
        .select('*', { count: 'exact', head: true });

      if (existingPostCount === 0 && members.postHolders?.length > 0) {
        const { error: postError } = await supabase.from("members_post_holders").insert(members.postHolders);
        if (postError) throw new Error(`Post Holders: ${postError.message}`);
        toast.success("Post holders migrated successfully");
      } else {
        toast.info("Post holders already exist, skipping...");
      }

      const { count: existingExecutiveCount } = await supabase
        .from("members_executive")
        .select('*', { count: 'exact', head: true });

      if (existingExecutiveCount === 0 && members.executiveTeam?.length > 0) {
        const { error: executiveError } = await supabase.from("members_executive").insert(members.executiveTeam);
        if (executiveError) throw new Error(`Executive Team: ${executiveError.message}`);
        toast.success("Executive team migrated successfully");
      } else {
        toast.info("Executive team already exists, skipping...");
      }

      const { count: existingGalleryCount } = await supabase
        .from("gallery")
        .select('*', { count: 'exact', head: true });

      if (existingGalleryCount === 0) {
        const { error: galleryError } = await supabase.from("gallery").insert(gallery);
        if (galleryError) throw new Error(`Gallery: ${galleryError.message}`);
        toast.success("Gallery migrated successfully");
      } else {
        toast.info("Gallery already exists, skipping...");
      }

      const { count: existingNoticesCount } = await supabase
        .from("notices")
        .select('*', { count: 'exact', head: true });

      if (existingNoticesCount === 0) {
        const { error: noticesError } = await supabase.from("notices").insert(notices);
        if (noticesError) throw new Error(`Notices: ${noticesError.message}`);
        toast.success("Notices migrated successfully");
      } else {
        toast.info("Notices already exist, skipping...");
      }

      const { count: existingHighlightsCount } = await supabase
        .from("event_highlights")
        .select('*', { count: 'exact', head: true });

      if (existingHighlightsCount === 0) {
        const mappedHighlights = highlights.map((h: any) => {
          const { instagramLink, ...rest } = h;
          return {
            ...rest,
            instagram_link: instagramLink
          };
        });
        const { error: highlightsError } = await supabase.from("event_highlights").insert(mappedHighlights);
        if (highlightsError) throw new Error(`Event Highlights: ${highlightsError.message}`);
        toast.success("Event highlights migrated successfully");
      } else {
        toast.info("Event highlights already exist, skipping...");
      }

      toast.success("Data migration completed successfully!");
    } catch (error: any) {
      toast.error(`Migration failed: ${error.message}`);
      console.error("Migration error:", error);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-red-500">Configuration Error</CardTitle>
            <CardDescription>Supabase is not properly configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              The application cannot connect to Supabase. Please ensure the following environment variables are set in Replit Secrets:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><code className="bg-gray-800 px-2 py-1 rounded">VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
              <li><code className="bg-gray-800 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              After adding the secrets, restart the application for changes to take effect.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Login to access admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="migration" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="migration">Data Migration</TabsTrigger>
            <TabsTrigger value="management">Content Management</TabsTrigger>
          </TabsList>

          <TabsContent value="migration">
            <Card>
              <CardHeader>
                <CardTitle>Migrate Data to Supabase</CardTitle>
                <CardDescription>
                  This will migrate all data from JSON files to your Supabase database.
                  Make sure the database tables are created first. Migration is idempotent - it will skip data that already exists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDataMigration}>
                  Start Migration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Manage events, members, gallery, and notices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Content management interface will be available here once migration is complete.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
