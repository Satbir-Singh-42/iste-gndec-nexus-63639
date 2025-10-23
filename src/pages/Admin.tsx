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
import { uploadImageToSupabase } from "@/lib/imageUpload";

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
  capacity?: string;
  organizer?: string;
  details?: string;
  agenda?: any[];
}

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
}

interface Member {
  id: number;
  name: string;
  position: string;
  image: string;
  email: string;
}

interface Faculty {
  id: number;
  name: string;
  title: string;
  image: string;
  description: string;
}

interface EventHighlight {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  poster: string;
  instagram_link: string;
  attendees: string;
  highlights: string[];
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
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [coreTeam, setCoreTeam] = useState<Member[]>([]);
  const [postHolders, setPostHolders] = useState<Member[]>([]);
  const [executive, setExecutive] = useState<Member[]>([]);
  const [eventHighlights, setEventHighlights] = useState<EventHighlight[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated && supabase) {
      fetchNotices();
      fetchEvents();
      fetchGallery();
      fetchFaculty();
      fetchCoreTeam();
      fetchPostHolders();
      fetchExecutive();
      fetchEventHighlights();
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

  const fetchFaculty = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_faculty').select('*').order('id', { ascending: false });
      if (error) throw error;
      setFaculty(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch faculty: ${error.message}`);
    }
  };

  const fetchCoreTeam = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_core_team').select('*').order('id', { ascending: false });
      if (error) throw error;
      setCoreTeam(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch core team: ${error.message}`);
    }
  };

  const fetchPostHolders = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_post_holders').select('*').order('id', { ascending: false });
      if (error) throw error;
      setPostHolders(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch post holders: ${error.message}`);
    }
  };

  const fetchExecutive = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_executive').select('*').order('id', { ascending: false });
      if (error) throw error;
      setExecutive(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch executive team: ${error.message}`);
    }
  };

  const deleteMember = async (id: number, table: string, type: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success(`${type} deleted successfully`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete ${type}: ${error.message}`);
    }
  };

  const fetchEventHighlights = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('event_highlights').select('*').order('id', { ascending: false });
      if (error) throw error;
      setEventHighlights(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch event highlights: ${error.message}`);
    }
  };

  const deleteEventHighlight = async (id: number) => {
    if (!supabase || !confirm('Are you sure you want to delete this event highlight?')) return;
    try {
      const { error } = await supabase.from('event_highlights').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event highlight deleted successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete event highlight: ${error.message}`);
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Faculty</CardTitle>
                      <CardDescription>Manage faculty advisors</CardDescription>
                    </div>
                    <AddFacultyDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faculty.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.title}</TableCell>
                          <TableCell>
                            <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditFacultyDialog member={member} onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                              <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id, 'members_faculty', 'faculty member')}>
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

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Core Team</CardTitle>
                      <CardDescription>Manage core team members</CardDescription>
                    </div>
                    <AddMemberDialog table="members_core_team" title="Add Core Team Member" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coreTeam.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditMemberDialog member={member} table="members_core_team" title="Edit Core Team Member" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                              <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id, 'members_core_team', 'core team member')}>
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

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Post Holders</CardTitle>
                      <CardDescription>Manage post holders</CardDescription>
                    </div>
                    <AddMemberDialog table="members_post_holders" title="Add Post Holder" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {postHolders.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditMemberDialog member={member} table="members_post_holders" title="Edit Post Holder" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                              <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id, 'members_post_holders', 'post holder')}>
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

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Executive Team</CardTitle>
                      <CardDescription>Manage executive team members</CardDescription>
                    </div>
                    <AddMemberDialog table="members_executive" title="Add Executive Member" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {executive.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditMemberDialog member={member} table="members_executive" title="Edit Executive Member" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                              <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id, 'members_executive', 'executive member')}>
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
            </div>
          </TabsContent>

          <TabsContent value="highlights">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Event Highlights</CardTitle>
                    <CardDescription>Add, edit, or delete past event highlights</CardDescription>
                  </div>
                  <AddEventHighlightDialog onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
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
                      <TableHead>Attendees</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventHighlights.map((highlight) => (
                      <TableRow key={highlight.id}>
                        <TableCell>{highlight.id}</TableCell>
                        <TableCell>{highlight.title}</TableCell>
                        <TableCell>{highlight.date}</TableCell>
                        <TableCell>{highlight.location}</TableCell>
                        <TableCell>{highlight.attendees}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditEventHighlightDialog highlight={highlight} onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
                            <Button variant="destructive" size="sm" onClick={() => deleteEventHighlight(highlight.id)}>
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
  const [datetime, setDatetime] = useState("");

  const handleDateTimeChange = (value: string) => {
    setDatetime(value);
    if (value) {
      const dt = new Date(value);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setFormData({ ...formData, date: dateStr, time: timeStr });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('notices').insert([formData]);
      if (error) throw error;
      toast.success('Notice added successfully');
      setOpen(false);
      setFormData({ title: "", date: "", time: "", type: "EVENT", status: "UPCOMING", description: "" });
      setDatetime("");
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
          <div>
            <Label htmlFor="datetime">Date and Time</Label>
            <Input 
              id="datetime" 
              type="datetime-local" 
              value={datetime} 
              onChange={(e) => handleDateTimeChange(e.target.value)} 
              required 
            />
            {formData.date && formData.time && (
              <p className="text-sm text-muted-foreground mt-1">
                Will display as: {formData.date} at {formData.time}
              </p>
            )}
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
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Add your notice description. Include links like: Visit - https://example.com" 
              rows={5}
              required 
            />
            <p className="text-sm text-muted-foreground mt-1">
              Add URLs in the description (e.g., https://example.com) to make the notice clickable
            </p>
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
  const [datetime, setDatetime] = useState("");

  const handleDateTimeChange = (value: string) => {
    setDatetime(value);
    if (value) {
      const dt = new Date(value);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setFormData({ ...formData, date: dateStr, time: timeStr });
    }
  };

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
          <div>
            <Label htmlFor="edit-datetime">Date and Time</Label>
            <Input 
              id="edit-datetime" 
              type="datetime-local" 
              value={datetime} 
              onChange={(e) => handleDateTimeChange(e.target.value)} 
            />
            <p className="text-sm text-muted-foreground mt-1">
              Current: {formData.date} at {formData.time}
            </p>
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
            <Textarea 
              id="edit-description" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Add your notice description. Include links like: Visit - https://example.com" 
              rows={5}
              required 
            />
            <p className="text-sm text-muted-foreground mt-1">
              Add URLs in the description (e.g., https://example.com) to make the notice clickable
            </p>
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
  const [dateInput, setDateInput] = useState("");

  const handleDateChange = (value: string) => {
    setDateInput(value);
    if (value) {
      const dt = new Date(value);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('events').insert([formData]);
      if (error) throw error;
      toast.success('Event added successfully');
      setOpen(false);
      setFormData({ title: "", date: "", time: "", location: "", description: "", status: "UPCOMING", capacity: "100", organizer: "ISTE GNDEC", details: "", agenda: [] });
      setDateInput("");
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
              <Input 
                id="event-date" 
                type="date"
                value={dateInput} 
                onChange={(e) => handleDateChange(e.target.value)} 
                required 
              />
              {formData.date && (
                <p className="text-sm text-muted-foreground mt-1">
                  Will display as: {formData.date}
                </p>
              )}
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
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="event-capacity">Capacity</Label>
              <Input 
                id="event-capacity" 
                type="number"
                value={formData.capacity} 
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} 
                placeholder="100"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="event-organizer">Organizer</Label>
            <Input 
              id="event-organizer" 
              value={formData.organizer} 
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} 
              placeholder="ISTE GNDEC"
            />
          </div>
          <div>
            <Label htmlFor="event-details">Details</Label>
            <Textarea 
              id="event-details" 
              value={formData.details} 
              onChange={(e) => setFormData({ ...formData, details: e.target.value })} 
              placeholder="Additional event details"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="event-agenda">Agenda (one item per line)</Label>
            <Textarea 
              id="event-agenda" 
              value={formData.agenda.join('\n')} 
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value.split('\n').filter(line => line.trim()) })} 
              placeholder="Registration&#10;Opening Ceremony&#10;Technical Talks"
              rows={5}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter each agenda item on a new line
            </p>
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
  const [dateInput, setDateInput] = useState("");

  const handleDateChange = (value: string) => {
    setDateInput(value);
    if (value) {
      const dt = new Date(value);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setFormData(event);
      setDateInput("");
    }
  };

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <Label htmlFor="edit-event-date">Date (optional - leave blank to keep current)</Label>
              <Input 
                id="edit-event-date" 
                type="date"
                value={dateInput} 
                onChange={(e) => handleDateChange(e.target.value)} 
              />
              <p className="text-sm text-muted-foreground mt-1">
                Current: {formData.date}
              </p>
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
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="edit-event-capacity">Capacity</Label>
              <Input 
                id="edit-event-capacity" 
                type="number"
                value={formData.capacity || ""} 
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} 
                placeholder="100"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-event-organizer">Organizer</Label>
            <Input 
              id="edit-event-organizer" 
              value={formData.organizer || ""} 
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} 
              placeholder="ISTE GNDEC"
            />
          </div>
          <div>
            <Label htmlFor="edit-event-details">Details</Label>
            <Textarea 
              id="edit-event-details" 
              value={formData.details || ""} 
              onChange={(e) => setFormData({ ...formData, details: e.target.value })} 
              placeholder="Additional event details"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="edit-event-agenda">Agenda (one item per line)</Label>
            <Textarea 
              id="edit-event-agenda" 
              value={formData.agenda?.join('\n') || ""} 
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value.split('\n').filter(line => line.trim()) })} 
              placeholder="Registration&#10;Opening Ceremony&#10;Technical Talks"
              rows={5}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter each agenda item on a new line
            </p>
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
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "Events",
    description: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'gallery');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    }
  };

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
            <Label htmlFor="gallery-image">Upload Image</Label>
            <Input id="gallery-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
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
            <Button type="submit" disabled={uploading || !formData.image}>Add Gallery Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditGalleryDialog({ item, onSuccess }: { item: GalleryItem; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(item);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'gallery');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    }
  };

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
            <Label htmlFor="edit-gallery-image">Upload Image</Label>
            <Input id="edit-gallery-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
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
            <Button type="submit" disabled={uploading}>Update Gallery Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddFacultyDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    image: "",
    description: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'faculty');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('members_faculty').insert([formData]);
      if (error) throw error;
      toast.success('Faculty member added successfully');
      setOpen(false);
      setFormData({ name: "", title: "", image: "", description: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add faculty: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Faculty</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Faculty Member</DialogTitle>
          <DialogDescription>Add a new faculty advisor</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="faculty-name">Name</Label>
            <Input id="faculty-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="faculty-title">Title</Label>
            <Input id="faculty-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="faculty-image">Profile Image</Label>
            <Input id="faculty-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          </div>
          <div>
            <Label htmlFor="faculty-description">Description</Label>
            <Textarea id="faculty-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading || !formData.image}>Add Faculty</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditFacultyDialog({ member, onSuccess }: { member: Faculty; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(member);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'faculty');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('members_faculty').update(formData).eq('id', member.id);
      if (error) throw error;
      toast.success('Faculty member updated successfully');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update faculty: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Faculty Member</DialogTitle>
          <DialogDescription>Update faculty information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-faculty-name">Name</Label>
            <Input id="edit-faculty-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-faculty-title">Title</Label>
            <Input id="edit-faculty-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-faculty-image">Profile Image</Label>
            <Input id="edit-faculty-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          </div>
          <div>
            <Label htmlFor="edit-faculty-description">Description</Label>
            <Textarea id="edit-faculty-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>Update Faculty</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddMemberDialog({ table, title, onSuccess }: { table: string; title: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: "",
    email: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'members');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from(table).insert([formData]);
      if (error) throw error;
      toast.success('Member added successfully');
      setOpen(false);
      setFormData({ name: "", position: "", image: "", email: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add member: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Add a new team member</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="member-name">Name</Label>
            <Input id="member-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="member-position">Position</Label>
            <Input id="member-position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="member-email">Email</Label>
            <Input id="member-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="member-image">Profile Image</Label>
            <Input id="member-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading || !formData.image}>Add Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditMemberDialog({ member, table, title, onSuccess }: { member: Member; table: string; title: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(member);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'members');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from(table).update(formData).eq('id', member.id);
      if (error) throw error;
      toast.success('Member updated successfully');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update member: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Update member information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-member-name">Name</Label>
            <Input id="edit-member-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-member-position">Position</Label>
            <Input id="edit-member-position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-member-email">Email</Label>
            <Input id="edit-member-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-member-image">Profile Image</Label>
            <Input id="edit-member-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>Update Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddEventHighlightDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    poster: "",
    instagram_link: "",
    attendees: "",
    highlights: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'event-highlights');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, poster: url });
      toast.success('Poster uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const highlightsArray = formData.highlights.split('\n').filter(h => h.trim());
      const { error } = await supabase.from('event_highlights').insert([{
        ...formData,
        highlights: highlightsArray
      }]);
      if (error) throw error;
      toast.success('Event highlight added successfully');
      setOpen(false);
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        poster: "",
        instagram_link: "",
        attendees: "",
        highlights: ""
      });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add event highlight: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Event Highlight</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Event Highlight</DialogTitle>
          <DialogDescription>Add a new past event highlight</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="highlight-title">Title *</Label>
            <Input id="highlight-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="highlight-date">Date *</Label>
            <Input id="highlight-date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="March 15, 2024" required />
          </div>
          <div>
            <Label htmlFor="highlight-poster">Event Poster *</Label>
            <Input id="highlight-poster" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.poster && <img src={formData.poster} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div>
            <Label htmlFor="highlight-instagram">Instagram Link (optional)</Label>
            <Input id="highlight-instagram" type="url" value={formData.instagram_link} onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })} placeholder="https://instagram.com/..." />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading || !formData.poster}>Add Event Highlight</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditEventHighlightDialog({ highlight, onSuccess }: { highlight: EventHighlight; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    ...highlight,
    highlights: highlight.highlights.join('\n')
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, 'event-highlights');
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, poster: url });
      toast.success('Poster uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const highlightsArray = formData.highlights.split('\n').filter((h: string) => h.trim());
      const { error } = await supabase.from('event_highlights').update({
        title: formData.title,
        date: formData.date,
        location: formData.location,
        description: formData.description,
        poster: formData.poster,
        instagram_link: formData.instagram_link,
        attendees: formData.attendees,
        highlights: highlightsArray
      }).eq('id', highlight.id);
      if (error) throw error;
      toast.success('Event highlight updated successfully');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update event highlight: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event Highlight</DialogTitle>
          <DialogDescription>Update event highlight information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-highlight-title">Title *</Label>
            <Input id="edit-highlight-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-highlight-date">Date *</Label>
            <Input id="edit-highlight-date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="edit-highlight-poster">Event Poster *</Label>
            <Input id="edit-highlight-poster" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.poster && <img src={formData.poster} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div>
            <Label htmlFor="edit-highlight-instagram">Instagram Link (optional)</Label>
            <Input id="edit-highlight-instagram" type="url" value={formData.instagram_link} onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>Update Event Highlight</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Admin;
