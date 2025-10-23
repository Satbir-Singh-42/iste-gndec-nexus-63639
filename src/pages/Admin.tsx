import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  description: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
}

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
}

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated && supabase) {
      fetchNotices();
      fetchEvents();
      fetchGallery();
    }
  }, [isAuthenticated, refreshTrigger]);

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

  const fetchNotices = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('notices').select('*').order('id', { ascending: false });
      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch notices: ${error.message}`);
    }
  };

  const fetchEvents = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('events').select('*').order('id', { ascending: false });
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch events: ${error.message}`);
    }
  };

  const fetchGallery = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false });
      if (error) throw error;
      setGallery(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch gallery: ${error.message}`);
    }
  };

  const deleteNotice = async (id: number) => {
    if (!supabase || !confirm('Are you sure you want to delete this notice?')) return;
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
      toast.success('Notice deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete notice: ${error.message}`);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!supabase || !confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete event: ${error.message}`);
    }
  };

  const deleteGalleryItem = async (id: number) => {
    if (!supabase || !confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      toast.success('Gallery item deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete gallery item: ${error.message}`);
    }
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
      setRefreshTrigger(prev => prev + 1);
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
      <div className="max-w-7xl mx-auto">
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

        <Tabs defaultValue="notices" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
          </TabsList>

          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Notices</CardTitle>
                    <CardDescription>Add, edit, or delete notices</CardDescription>
                  </div>
                  <AddNoticeDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notices.map((notice) => (
                      <TableRow key={notice.id}>
                        <TableCell>{notice.id}</TableCell>
                        <TableCell>{notice.title}</TableCell>
                        <TableCell>{notice.date}</TableCell>
                        <TableCell>{notice.time}</TableCell>
                        <TableCell>{notice.type}</TableCell>
                        <TableCell>{notice.status}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditNoticeDialog notice={notice} onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                            <Button variant="destructive" size="sm" onClick={() => deleteNotice(notice.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Events</CardTitle>
                    <CardDescription>Add, edit, or delete events</CardDescription>
                  </div>
                  <AddEventDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.id}</TableCell>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.status}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditEventDialog event={event} onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                            <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Gallery</CardTitle>
                    <CardDescription>Add, edit, or delete gallery items</CardDescription>
                  </div>
                  <AddGalleryDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Image URL</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gallery.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.image}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditGalleryDialog item={item} onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                            <Button variant="destructive" size="sm" onClick={() => deleteGalleryItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Manage Members</CardTitle>
                <CardDescription>Manage faculty, core team, post holders, and executive members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <strong>Members Management:</strong> View and manage different member categories including Faculty, Core Team, Post Holders, and Executive Team members. Full CRUD functionality can be accessed by viewing the data in each respective table in your Supabase dashboard, or you can extend this interface with specific member management dialogs similar to the Notices and Events tabs.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Faculty</h3>
                    <p className="text-sm text-gray-400">Table: members_faculty</p>
                    <Button className="mt-2" variant="outline" onClick={() => window.open('https://vtdsswjfgpgnfjgpjwhw.supabase.co/project/_/editor', '_blank')}>
                      Edit in Supabase
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Core Team</h3>
                    <p className="text-sm text-gray-400">Table: members_core_team</p>
                    <Button className="mt-2" variant="outline" onClick={() => window.open('https://vtdsswjfgpgnfjgpjwhw.supabase.co/project/_/editor', '_blank')}>
                      Edit in Supabase
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Post Holders</h3>
                    <p className="text-sm text-gray-400">Table: members_post_holders</p>
                    <Button className="mt-2" variant="outline" onClick={() => window.open('https://vtdsswjfgpgnfjgpjwhw.supabase.co/project/_/editor', '_blank')}>
                      Edit in Supabase
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Executive Team</h3>
                    <p className="text-sm text-gray-400">Table: members_executive</p>
                    <Button className="mt-2" variant="outline" onClick={() => window.open('https://vtdsswjfgpgnfjgpjwhw.supabase.co/project/_/editor', '_blank')}>
                      Edit in Supabase
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
        </Tabs>
      </div>
    </div>
  );
};

function AddNoticeDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    type: "EVENT",
    status: "UPCOMING",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('notices').insert([formData]);
      if (error) throw error;
      toast.success('Notice added successfully');
      setOpen(false);
      setFormData({ title: "", date: "", time: "", type: "EVENT", status: "UPCOMING", description: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add notice: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Notice</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Notice</DialogTitle>
          <DialogDescription>Create a new notice for the notice board</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="March 15, 2024" required />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EVENT">EVENT</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">ANNOUNCEMENT</SelectItem>
                  <SelectItem value="WORKSHOP">WORKSHOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                  <SelectItem value="REGISTRATION">REGISTRATION</SelectItem>
                  <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="submit">Add Notice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditNoticeDialog({ notice, onSuccess }: { notice: Notice; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(notice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('notices').update(formData).eq('id', notice.id);
      if (error) throw error;
      toast.success('Notice updated successfully');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update notice: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Notice</DialogTitle>
          <DialogDescription>Update notice information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input id="edit-date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="edit-time">Time</Label>
              <Input id="edit-time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EVENT">EVENT</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">ANNOUNCEMENT</SelectItem>
                  <SelectItem value="WORKSHOP">WORKSHOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                  <SelectItem value="REGISTRATION">REGISTRATION</SelectItem>
                  <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="submit">Update Notice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddEventDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "UPCOMING",
    capacity: "100",
    organizer: "ISTE GNDEC",
    details: "",
    agenda: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('events').insert([formData]);
      if (error) throw error;
      toast.success('Event added successfully');
      setOpen(false);
      setFormData({ title: "", date: "", time: "", location: "", description: "", status: "UPCOMING", capacity: "100", organizer: "ISTE GNDEC", details: "", agenda: [] });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add event: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Event</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Create a new event</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event-title">Title</Label>
            <Input id="event-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="March 15, 2024" required />
            </div>
            <div>
              <Label htmlFor="event-time">Time</Label>
              <Input id="event-time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM" required />
            </div>
          </div>
          <div>
            <Label htmlFor="event-location">Location</Label>
            <Input id="event-location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="event-description">Description</Label>
            <Textarea id="event-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="event-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                <SelectItem value="ONGOING">ONGOING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditEventDialog({ event, onSuccess }: { event: Event; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(event);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('events').update(formData).eq('id', event.id);
      if (error) throw error;
      toast.success('Event updated successfully');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update event: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update event information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-event-title">Title</Label>
            <Input id="edit-event-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-event-date">Date</Label>
              <Input id="edit-event-date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="edit-event-time">Time</Label>
              <Input id="edit-event-time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-event-location">Location</Label>
            <Input id="edit-event-location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-event-description">Description</Label>
            <Textarea id="edit-event-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-event-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                <SelectItem value="ONGOING">ONGOING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Update Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddGalleryDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "Events",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('gallery').insert([formData]);
      if (error) throw error;
      toast.success('Gallery item added successfully');
      setOpen(false);
      setFormData({ title: "", image: "", category: "Events", description: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add gallery item: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Gallery Item</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Gallery Item</DialogTitle>
          <DialogDescription>Add a new image to the gallery</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="gallery-title">Title</Label>
            <Input id="gallery-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="gallery-image">Image URL</Label>
            <Input id="gallery-image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." required />
          </div>
          <div>
            <Label htmlFor="gallery-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Workshops">Workshops</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gallery-description">Description</Label>
            <Textarea id="gallery-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="submit">Add Gallery Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditGalleryDialog({ item, onSuccess }: { item: GalleryItem; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(item);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('gallery').update(formData).eq('id', item.id);
      if (error) throw error;
      toast.success('Gallery item updated successfully');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update gallery item: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
          <DialogDescription>Update gallery item information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-gallery-title">Title</Label>
            <Input id="edit-gallery-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-gallery-image">Image URL</Label>
            <Input id="edit-gallery-image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-gallery-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Workshops">Workshops</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-gallery-description">Description</Label>
            <Textarea id="edit-gallery-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="submit">Update Gallery Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Admin;
