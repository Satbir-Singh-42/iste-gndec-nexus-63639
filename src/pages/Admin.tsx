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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Eye, EyeOff, ChevronUp, ChevronDown, Search, X, CalendarIcon } from "lucide-react";
import { uploadImageToSupabase, uploadMultipleImages } from "@/lib/imageUpload";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  hidden?: boolean;
  display_order?: number;
}

interface GalleryItem {
  id: number;
  title: string;
  images: string[];
  category: string;
  description: string;
  hidden?: boolean;
  display_order?: number;
}

interface Member {
  id: number;
  name: string;
  position: string;
  image: string;
  email: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  hidden?: boolean;
  display_order?: number;
}

interface Faculty {
  id: number;
  name: string;
  title: string;
  image: string;
  description: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  hidden?: boolean;
  display_order?: number;
}

interface EventHighlight {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  poster: string;
  instagram_link: string;
  highlights: string[];
  hidden?: boolean;
  display_order?: number;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [noticesSearch, setNoticesSearch] = useState("");
  const [eventsSearch, setEventsSearch] = useState("");
  const [highlightsSearch, setHighlightsSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
  const [coreTeamSearch, setCoreTeamSearch] = useState("");
  const [postHoldersSearch, setPostHoldersSearch] = useState("");
  const [executiveSearch, setExecutiveSearch] = useState("");
  const [gallerySearch, setGallerySearch] = useState("");

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
      const { data, error } = await supabase.from('events').select('*').order('display_order', { ascending: false, nullsFirst: false }).order('id', { ascending: false });
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch events: ${error.message}`);
    }
  };

  const fetchGallery = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true });
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

  const toggleGalleryVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('gallery').update({ hidden: !currentHidden }).eq('id', id);
      if (error) throw error;
      toast.success(`Gallery item ${!currentHidden ? 'hidden' : 'visible'} successfully`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateGalleryOrder = async (id: number, newOrder: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('gallery').update({ display_order: newOrder }).eq('id', id);
      if (error) throw error;
      toast.success('Gallery item order updated');
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveGalleryUp = (items: GalleryItem[], index: number) => {
    if (index === 0) return;
    const currentItem = items[index];
    const previousItem = items[index - 1];
    const currentOrder = currentItem.display_order || index;
    const previousOrder = previousItem.display_order || index - 1;
    updateGalleryOrder(currentItem.id, previousOrder);
    updateGalleryOrder(previousItem.id, currentOrder);
  };

  const moveGalleryDown = (items: GalleryItem[], index: number) => {
    if (index === items.length - 1) return;
    const currentItem = items[index];
    const nextItem = items[index + 1];
    const currentOrder = currentItem.display_order || index;
    const nextOrder = nextItem.display_order || index + 1;
    updateGalleryOrder(currentItem.id, nextOrder);
    updateGalleryOrder(nextItem.id, currentOrder);
  };

  const fetchFaculty = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_faculty').select('*').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true });
      if (error) throw error;
      setFaculty(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch faculty: ${error.message}`);
    }
  };

  const fetchCoreTeam = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_core_team').select('*').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true });
      if (error) throw error;
      setCoreTeam(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch core team: ${error.message}`);
    }
  };

  const fetchPostHolders = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_post_holders').select('*').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true });
      if (error) throw error;
      setPostHolders(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch post holders: ${error.message}`);
    }
  };

  const fetchExecutive = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('members_executive').select('*').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true });
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

  const toggleMemberVisibility = async (id: number, table: string, currentHidden: boolean, type: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from(table).update({ hidden: !currentHidden }).eq('id', id);
      if (error) throw error;
      toast.success(`${type} ${!currentHidden ? 'hidden' : 'visible'} successfully`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateMemberOrder = async (id: number, table: string, newOrder: number, type: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from(table).update({ display_order: newOrder }).eq('id', id);
      if (error) throw error;
      toast.success(`${type} order updated`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveMemberUp = (members: (Member | Faculty)[], index: number, table: string, type: string) => {
    if (index === 0) return;
    const currentMember = members[index];
    const previousMember = members[index - 1];
    const currentOrder = currentMember.display_order || index;
    const previousOrder = previousMember.display_order || index - 1;
    updateMemberOrder(currentMember.id, table, previousOrder, type);
    updateMemberOrder(previousMember.id, table, currentOrder, type);
  };

  const moveMemberDown = (members: (Member | Faculty)[], index: number, table: string, type: string) => {
    if (index === members.length - 1) return;
    const currentMember = members[index];
    const nextMember = members[index + 1];
    const currentOrder = currentMember.display_order || index;
    const nextOrder = nextMember.display_order || index + 1;
    updateMemberOrder(currentMember.id, table, nextOrder, type);
    updateMemberOrder(nextMember.id, table, currentOrder, type);
  };

  const fetchEventHighlights = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('event_highlights').select('*').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true });
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

  const toggleEventVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('events').update({ hidden: !currentHidden }).eq('id', id);
      if (error) throw error;
      toast.success(`Event ${!currentHidden ? 'hidden' : 'visible'} successfully`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateEventOrder = async (id: number, newOrder: number, skipRefresh: boolean = false) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('events').update({ display_order: newOrder }).eq('id', id);
      if (error) throw error;
      if (!skipRefresh) {
        toast.success('Event order updated');
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveEventUp = async (items: Event[], index: number) => {
    if (index === 0) return;
    const currentItem = items[index];
    const previousItem = items[index - 1];
    const currentOrder = currentItem.display_order ?? (items.length - index);
    const previousOrder = previousItem.display_order ?? (items.length - index + 1);
    await updateEventOrder(currentItem.id, previousOrder, true);
    await updateEventOrder(previousItem.id, currentOrder, true);
    toast.success('Event order updated');
    setRefreshTrigger(prev => prev + 1);
  };

  const moveEventDown = async (items: Event[], index: number) => {
    if (index === items.length - 1) return;
    const currentItem = items[index];
    const nextItem = items[index + 1];
    const currentOrder = currentItem.display_order ?? (items.length - index);
    const nextOrder = nextItem.display_order ?? (items.length - index - 1);
    await updateEventOrder(currentItem.id, nextOrder, true);
    await updateEventOrder(nextItem.id, currentOrder, true);
    toast.success('Event order updated');
    setRefreshTrigger(prev => prev + 1);
  };

  const toggleHighlightVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('event_highlights').update({ hidden: !currentHidden }).eq('id', id);
      if (error) throw error;
      toast.success(`Highlight ${!currentHidden ? 'hidden' : 'visible'} successfully`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateHighlightOrder = async (id: number, newOrder: number, skipRefresh: boolean = false) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('event_highlights').update({ display_order: newOrder }).eq('id', id);
      if (error) throw error;
      if (!skipRefresh) {
        toast.success('Highlight order updated');
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveHighlightUp = async (items: EventHighlight[], index: number) => {
    if (index === 0) return;
    const currentItem = items[index];
    const previousItem = items[index - 1];
    const currentOrder = currentItem.display_order ?? (items.length - index);
    const previousOrder = previousItem.display_order ?? (items.length - index + 1);
    await updateHighlightOrder(currentItem.id, previousOrder, true);
    await updateHighlightOrder(previousItem.id, currentOrder, true);
    toast.success('Highlight order updated');
    setRefreshTrigger(prev => prev + 1);
  };

  const moveHighlightDown = async (items: EventHighlight[], index: number) => {
    if (index === items.length - 1) return;
    const currentItem = items[index];
    const nextItem = items[index + 1];
    const currentOrder = currentItem.display_order ?? (items.length - index);
    const nextOrder = nextItem.display_order ?? (items.length - index - 1);
    await updateHighlightOrder(currentItem.id, nextOrder, true);
    await updateHighlightOrder(nextItem.id, currentOrder, true);
    toast.success('Highlight order updated');
    setRefreshTrigger(prev => prev + 1);
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
              The application cannot connect to Supabase. Please ensure the following environment variables are set:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><code className="bg-gray-800 px-2 py-1 rounded">VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
              <li><code className="bg-gray-800 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              After adding the environment variables, restart the application for changes to take effect.
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
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
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
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or type..."
                      value={noticesSearch}
                      onChange={(e) => setNoticesSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
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
                    {notices
                      .filter(notice => 
                        notice.title.toLowerCase().includes(noticesSearch.toLowerCase()) ||
                        notice.type.toLowerCase().includes(noticesSearch.toLowerCase())
                      )
                      .map((notice) => (
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
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or location..."
                      value={eventsSearch}
                      onChange={(e) => setEventsSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Order</TableHead>
                        <TableHead className="w-12">Visible</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events
                        .filter(event => 
                          event.title.toLowerCase().includes(eventsSearch.toLowerCase()) ||
                          event.location.toLowerCase().includes(eventsSearch.toLowerCase())
                        )
                        .map((event, index, filteredArray) => (
                        <TableRow key={event.id} className={event.hidden ? 'opacity-50' : ''}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveEventUp(events, events.indexOf(event))}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveEventDown(events, events.indexOf(event))}
                                disabled={index === filteredArray.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEventVisibility(event.id, event.hidden || false)}
                            >
                              {event.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </TableCell>
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
                </div>
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
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or category..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Order</TableHead>
                        <TableHead className="w-12">Visible</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gallery
                        .filter(item => 
                          item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(gallerySearch.toLowerCase())
                        )
                        .map((item, index, filteredArray) => (
                        <TableRow key={item.id} className={item.hidden ? 'opacity-50' : ''}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveGalleryUp(gallery, gallery.indexOf(item))}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveGalleryDown(gallery, gallery.indexOf(item))}
                                disabled={index === filteredArray.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleGalleryVisibility(item.id, item.hidden || false)}
                            >
                              {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {item.images?.slice(0, 3).map((img, idx) => (
                                <img key={idx} src={img} alt={`${item.title} ${idx + 1}`} className="w-12 h-12 object-cover rounded" />
                              ))}
                              {item.images?.length > 3 && (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                                  +{item.images.length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>
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
                </div>
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
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or title..."
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Order</TableHead>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {faculty
                          .filter(member => 
                            member.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
                            member.title.toLowerCase().includes(facultySearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                          <TableRow key={member.id} className={member.hidden ? 'opacity-50' : ''}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberUp(faculty, faculty.indexOf(member), 'members_faculty', 'faculty')}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberDown(faculty, faculty.indexOf(member), 'members_faculty', 'faculty')}
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMemberVisibility(member.id, 'members_faculty', member.hidden || false, 'faculty')}
                              >
                                {member.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </TableCell>
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
                  </div>
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
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or position..."
                        value={coreTeamSearch}
                        onChange={(e) => setCoreTeamSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Order</TableHead>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coreTeam
                          .filter(member => 
                            member.name.toLowerCase().includes(coreTeamSearch.toLowerCase()) ||
                            member.position.toLowerCase().includes(coreTeamSearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                          <TableRow key={member.id} className={member.hidden ? 'opacity-50' : ''}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberUp(coreTeam, coreTeam.indexOf(member), 'members_core_team', 'core team member')}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberDown(coreTeam, coreTeam.indexOf(member), 'members_core_team', 'core team member')}
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMemberVisibility(member.id, 'members_core_team', member.hidden || false, 'core team member')}
                              >
                                {member.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </TableCell>
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
                  </div>
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
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or position..."
                        value={postHoldersSearch}
                        onChange={(e) => setPostHoldersSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Order</TableHead>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {postHolders
                          .filter(member => 
                            member.name.toLowerCase().includes(postHoldersSearch.toLowerCase()) ||
                            member.position.toLowerCase().includes(postHoldersSearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                          <TableRow key={member.id} className={member.hidden ? 'opacity-50' : ''}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberUp(postHolders, postHolders.indexOf(member), 'members_post_holders', 'post holder')}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberDown(postHolders, postHolders.indexOf(member), 'members_post_holders', 'post holder')}
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMemberVisibility(member.id, 'members_post_holders', member.hidden || false, 'post holder')}
                              >
                                {member.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </TableCell>
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
                  </div>
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
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or position..."
                        value={executiveSearch}
                        onChange={(e) => setExecutiveSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Order</TableHead>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {executive
                          .filter(member => 
                            member.name.toLowerCase().includes(executiveSearch.toLowerCase()) ||
                            member.position.toLowerCase().includes(executiveSearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                          <TableRow key={member.id} className={member.hidden ? 'opacity-50' : ''}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberUp(executive, executive.indexOf(member), 'members_executive', 'executive member')}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => moveMemberDown(executive, executive.indexOf(member), 'members_executive', 'executive member')}
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMemberVisibility(member.id, 'members_executive', member.hidden || false, 'executive member')}
                              >
                                {member.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </TableCell>
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
                  </div>
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
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or location..."
                      value={highlightsSearch}
                      onChange={(e) => setHighlightsSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Order</TableHead>
                        <TableHead className="w-12">Visible</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventHighlights
                        .filter(highlight => 
                          highlight.title.toLowerCase().includes(highlightsSearch.toLowerCase()) ||
                          highlight.location.toLowerCase().includes(highlightsSearch.toLowerCase())
                        )
                        .map((highlight, index, filteredArray) => (
                        <TableRow key={highlight.id} className={highlight.hidden ? 'opacity-50' : ''}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveHighlightUp(eventHighlights, eventHighlights.indexOf(highlight))}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => moveHighlightDown(eventHighlights, eventHighlights.indexOf(highlight))}
                                disabled={index === filteredArray.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleHighlightVisibility(highlight.id, highlight.hidden || false)}
                            >
                              {highlight.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell>{highlight.title}</TableCell>
                          <TableCell>{highlight.date}</TableCell>
                          <TableCell>{highlight.location}</TableCell>
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
                </div>
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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeInput, setTimeInput] = useState("");

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleTimeChange = (value: string) => {
    setTimeInput(value);
    setFormData({ ...formData, time: value });
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
      setSelectedDate(undefined);
      setTimeInput("");
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Notice</DialogTitle>
          <DialogDescription>Create a new notice for the notice board</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover text-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time"
                value={timeInput} 
                onChange={(e) => handleTimeChange(e.target.value)} 
                required
                className="text-white"
              />
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditNoticeDialog({ notice, onSuccess }: { notice: Notice; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(notice);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeInput, setTimeInput] = useState("");

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleTimeChange = (value: string) => {
    setTimeInput(value);
    setFormData({ ...formData, time: value });
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Notice</DialogTitle>
          <DialogDescription>Update notice information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date (optional - leave blank to keep current)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover text-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-1">
                Current: {formData.date}
              </p>
            </div>
            <div>
              <Label htmlFor="edit-time">Time (optional)</Label>
              <Input 
                id="edit-time" 
                type="time"
                value={timeInput} 
                onChange={(e) => handleTimeChange(e.target.value)} 
                className="text-white"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Current: {formData.time}
              </p>
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
        </ScrollArea>
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
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { data: maxOrderData } = await supabase
        .from('events')
        .select('display_order')
        .order('display_order', { ascending: false, nullsFirst: false })
        .limit(1)
        .single();
      
      const newDisplayOrder = (maxOrderData?.display_order ?? 0) + 1;
      
      const { error } = await supabase.from('events').insert([{ ...formData, display_order: newDisplayOrder }]);
      if (error) throw error;
      toast.success('Event added successfully');
      setOpen(false);
      setFormData({ title: "", date: "", time: "", location: "", description: "", status: "UPCOMING", capacity: "100", organizer: "ISTE GNDEC", details: "", agenda: [] });
      setSelectedDate(undefined);
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Create a new event</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event-title">Title</Label>
            <Input id="event-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover text-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="event-time">Time</Label>
              <Input id="event-time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 AM" required className="text-white" />
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditEventDialog({ event, onSuccess }: { event: Event; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(event);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setFormData(event);
      setSelectedDate(undefined);
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update event information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-4 pb-2">
          <div>
            <Label htmlFor="edit-event-title">Title</Label>
            <Input id="edit-event-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date (optional - leave blank to keep current)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover text-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-1">
                Current: {formData.date}
              </p>
            </div>
            <div>
              <Label htmlFor="edit-event-time">Time</Label>
              <Input id="edit-event-time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required className="text-white" />
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
        </form>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button type="submit" onClick={(e) => {
            e.preventDefault();
            const form = document.getElementById('edit-event-form') as HTMLFormElement;
            if (form) form.requestSubmit();
          }}>Update Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddGalleryDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "Events",
    description: ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log(`Selected ${files.length} file(s)`);
    
    setUploading(true);
    const fileArray = Array.from(files);
    console.log('Files to upload:', fileArray.map(f => f.name));
    
    const { urls, errors } = await uploadMultipleImages(fileArray, 'gallery');
    setUploading(false);

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }
    
    if (urls.length > 0) {
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success(`${urls.length} image(s) uploaded successfully`);
    }
    
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...uploadedImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setUploadedImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === uploadedImages.length - 1) return;
    const newImages = [...uploadedImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setUploadedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || uploadedImages.length === 0) return;

    try {
      const galleryItem = {
        title: formData.title,
        images: uploadedImages,
        category: formData.category,
        description: formData.description
      };

      const { error } = await supabase.from('gallery').insert([galleryItem]);
      if (error) throw error;
      
      toast.success(`Gallery item added with ${uploadedImages.length} image(s)`);
      setOpen(false);
      setFormData({ title: "", category: "Events", description: "" });
      setUploadedImages([]);
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[85vh] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Gallery Items</DialogTitle>
          <DialogDescription>Add one or more images to the gallery</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-2 sm:pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="gallery-title">Title</Label>
              <Input id="gallery-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="gallery-image">Upload Images (Multiple)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                💡 Tip: Hold Ctrl (Windows) or Cmd (Mac) to select multiple images at once
              </p>
              <Input 
                id="gallery-image" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
                disabled={uploading} 
              />
              {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
              {uploadedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className="bg-blue-500 text-white rounded-full p-1"
                            title="Move left"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                        )}
                        {index < uploadedImages.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className="bg-blue-500 text-white rounded-full p-1"
                            title="Move right"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white rounded-full p-1"
                          title="Remove"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {uploadedImages.length} image(s) selected
              </p>
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
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={uploading || uploadedImages.length === 0}>
            Add {uploadedImages.length > 0 ? `${uploadedImages.length} ` : ''}Gallery Item{uploadedImages.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditGalleryDialog({ item, onSuccess }: { item: GalleryItem; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(item);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Initialize uploadedImages with existing images when dialog opens
  useEffect(() => {
    if (open) {
      setUploadedImages(item.images || []);
    }
  }, [open, item.images]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log(`Selected ${files.length} file(s) for edit`);
    
    setUploading(true);
    const fileArray = Array.from(files);
    console.log('Files to upload:', fileArray.map(f => f.name));
    
    const { urls, errors } = await uploadMultipleImages(fileArray, 'gallery');
    setUploading(false);

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }
    
    if (urls.length > 0) {
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success(`${urls.length} image(s) uploaded successfully`);
    }
    
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...uploadedImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setUploadedImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === uploadedImages.length - 1) return;
    const newImages = [...uploadedImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setUploadedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      // Update the gallery item with all images
      const updatedData = {
        ...formData,
        images: uploadedImages
      };
      
      const { error } = await supabase.from('gallery').update(updatedData).eq('id', item.id);
      if (error) throw error;
      
      toast.success(`Gallery item updated with ${uploadedImages.length} image(s)`);
      setOpen(false);
      setUploadedImages([]);
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[85vh] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
          <DialogDescription>Update gallery item information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-2 sm:pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-gallery-title">Title</Label>
              <Input id="edit-gallery-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="edit-gallery-image">Images</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Upload new images or manage existing ones. You can reorder images by using the up/down arrows.
              </p>
              <Input 
                id="edit-gallery-image" 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageUpload} 
                disabled={uploading} 
              />
              {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
              {uploadedImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Images ({uploadedImages.length}):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImageUp(index)}
                              className="bg-blue-500 text-white rounded-full p-1"
                              title="Move left"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                          )}
                          {index < uploadedImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImageDown(index)}
                              className="bg-blue-500 text-white rounded-full p-1"
                              title="Move right"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full p-1"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={uploading}>Update Gallery Item</Button>
        </DialogFooter>
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
    description: "",
    linkedin: "",
    github: "",
    instagram: ""
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
      const dataToInsert = {
        name: formData.name,
        title: formData.title,
        image: formData.image,
        description: formData.description,
        ...(formData.linkedin && { linkedin: formData.linkedin }),
        ...(formData.github && { github: formData.github }),
        ...(formData.instagram && { instagram: formData.instagram })
      };
      const { error } = await supabase.from('members_faculty').insert([dataToInsert]);
      if (error) throw error;
      toast.success('Faculty member added successfully');
      setOpen(false);
      setFormData({ name: "", title: "", image: "", description: "", linkedin: "", github: "", instagram: "" });
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Faculty Member</DialogTitle>
          <DialogDescription>Add a new faculty advisor</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
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
          <div>
            <Label htmlFor="faculty-linkedin">LinkedIn URL (optional)</Label>
            <Input id="faculty-linkedin" type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <Label htmlFor="faculty-github">GitHub URL (optional)</Label>
            <Input id="faculty-github" type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div>
            <Label htmlFor="faculty-instagram">Instagram URL (optional)</Label>
            <Input id="faculty-instagram" type="url" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/username" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading || !formData.image}>Add Faculty</Button>
          </DialogFooter>
          </form>
        </ScrollArea>
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Faculty Member</DialogTitle>
          <DialogDescription>Update faculty information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
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
          <div>
            <Label htmlFor="edit-faculty-linkedin">LinkedIn URL (optional)</Label>
            <Input id="edit-faculty-linkedin" type="url" value={formData.linkedin || ""} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <Label htmlFor="edit-faculty-github">GitHub URL (optional)</Label>
            <Input id="edit-faculty-github" type="url" value={formData.github || ""} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div>
            <Label htmlFor="edit-faculty-instagram">Instagram URL (optional)</Label>
            <Input id="edit-faculty-instagram" type="url" value={formData.instagram || ""} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/username" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>Update Faculty</Button>
          </DialogFooter>
          </form>
        </ScrollArea>
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
    email: "",
    linkedin: "",
    github: "",
    instagram: ""
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
      const dataToInsert = {
        name: formData.name,
        position: formData.position,
        image: formData.image,
        email: formData.email,
        ...(formData.linkedin && { linkedin: formData.linkedin }),
        ...(formData.github && { github: formData.github }),
        ...(formData.instagram && { instagram: formData.instagram })
      };
      const { error } = await supabase.from(table).insert([dataToInsert]);
      if (error) throw error;
      toast.success('Member added successfully');
      setOpen(false);
      setFormData({ name: "", position: "", image: "", email: "", linkedin: "", github: "", instagram: "" });
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Add a new team member</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
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
            <Label htmlFor="member-linkedin">LinkedIn URL (optional)</Label>
            <Input id="member-linkedin" type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <Label htmlFor="member-github">GitHub URL (optional)</Label>
            <Input id="member-github" type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div>
            <Label htmlFor="member-instagram">Instagram URL (optional)</Label>
            <Input id="member-instagram" type="url" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/username" />
          </div>
          <div>
            <Label htmlFor="member-image">Profile Image (optional)</Label>
            <Input id="member-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>Add Member</Button>
          </DialogFooter>
          </form>
        </ScrollArea>
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Update member information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
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
            <Label htmlFor="edit-member-linkedin">LinkedIn URL (optional)</Label>
            <Input id="edit-member-linkedin" type="url" value={formData.linkedin || ""} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <Label htmlFor="edit-member-github">GitHub URL (optional)</Label>
            <Input id="edit-member-github" type="url" value={formData.github || ""} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div>
            <Label htmlFor="edit-member-instagram">Instagram URL (optional)</Label>
            <Input id="edit-member-instagram" type="url" value={formData.instagram || ""} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/username" />
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddEventHighlightDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    poster: "",
    instagram_link: "",
    highlights: ""
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

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
        highlights: ""
      });
      setSelectedDate(undefined);
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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Event Highlight</DialogTitle>
          <DialogDescription>Add a new past event highlight</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="highlight-title">Title *</Label>
            <Input id="highlight-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover text-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditEventHighlightDialog({ highlight, onSuccess }: { highlight: EventHighlight; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    ...highlight,
    highlights: highlight.highlights.join('\n')
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormData({ ...formData, date: dateStr });
    }
  };

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
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Event Highlight</DialogTitle>
          <DialogDescription>Update event highlight information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-highlight-title">Title *</Label>
            <Input id="edit-highlight-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Date (optional - leave blank to keep current)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover text-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground mt-1">
              Current: {formData.date}
            </p>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default Admin;
