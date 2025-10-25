import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  CalendarIcon,
} from "lucide-react";
import { 
  uploadImageToSupabase, 
  uploadMultipleImages, 
  deleteImageFromSupabase, 
  deleteMultipleImagesFromSupabase 
} from "@/lib/imageUpload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { RichTextEditor } from "@/components/RichTextEditor";
import { FileUploadField } from "@/components/FileUploadField";
import { MultipleFileUpload } from "@/components/MultipleFileUpload";
import { TimePicker } from "@/components/ui/time-picker";
import "@/styles/quill-custom.css";
import { normalizeUrl } from "@/lib/utils";

// Helper function to convert time to 12-hour format (handles both 24-hour and 12-hour input)
const convertTo12Hour = (time: string): string => {
  if (!time) return "";

  // If already in 12-hour format, return as is
  if (time.match(/AM|PM|am|pm/)) return time;

  // Convert from 24-hour format
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

// Helper function to convert 12-hour time to 24-hour format for storage
const convertTo24Hour = (time12: string): string => {
  if (!time12) return "";
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return time12;

  let [, hours, minutes, period] = match;
  let hour = parseInt(hours, 10);

  if (period.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, "0")}:${minutes}`;
};

interface Notice {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  description: string;
  rich_description?: string;
  poster_url?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  external_link?: string;
  hidden?: boolean;
  display_order?: number;
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

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_link?: string;
  demo_link?: string;
  status: string;
  category: string;
  featured?: boolean;
  hidden?: boolean;
  display_order?: number;
}

interface ChapterAward {
  id: number;
  award_title: string;
  year: string;
  description: string;
  certificate_image: string;
  certificate_images?: string[];
  hidden?: boolean;
  display_order?: number;
}

interface PastConvenor {
  id: number;
  name: string;
  image: string;
  tenure_start: string;
  tenure_end: string;
  tenure_month?: number | null;
  description?: string;
  hidden?: boolean;
  display_order?: number;
}

interface StudentAchievement {
  id: number;
  student_name: string;
  event_name: string;
  position: string;
  date: string;
  organized_by: string;
  description: string;
  achievement_image?: string;
  achievement_images?: string[];
  linkedin?: string;
  github?: string;
  instagram?: string;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [chapterAwards, setChapterAwards] = useState<ChapterAward[]>([]);
  const [pastConvenors, setPastConvenors] = useState<PastConvenor[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [showProjectsInNavbar, setShowProjectsInNavbar] = useState(false);
  const [showAchievementsInNavbar, setShowAchievementsInNavbar] = useState(false);
  const [hideChapterAwards, setHideChapterAwards] = useState(false);
  const [hidePastConvenors, setHidePastConvenors] = useState(false);
  const [hideStudentAchievements, setHideStudentAchievements] = useState(false);
  const [showExecutiveTeam, setShowExecutiveTeam] = useState(true);
  const [showNoticeBoardOnHome, setShowNoticeBoardOnHome] = useState(true);
  const [contactFormEnabled, setContactFormEnabled] = useState(true);
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
  const [projectsSearch, setProjectsSearch] = useState("");
  const [chapterAwardsSearch, setChapterAwardsSearch] = useState("");
  const [pastConvenorsSearch, setPastConvenorsSearch] = useState("");
  const [studentAchievementsSearch, setStudentAchievementsSearch] = useState("");

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
      fetchProjects();
      fetchChapterAwards();
      fetchPastConvenors();
      fetchStudentAchievements();
      fetchSiteSettings();
    }
  }, [isAuthenticated, refreshTrigger]);

  const checkAuthStatus = async () => {
    if (!supabase) {
      setCheckingAuth(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      toast.error(
        "Supabase is not configured. Please check your environment variables."
      );
      return;
    }

    // Input validation and sanitization
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (sanitizedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Check for suspicious patterns (basic XSS/injection attempt detection)
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /SELECT.*FROM/i,
      /DROP.*TABLE/i,
      /INSERT.*INTO/i,
      /DELETE.*FROM/i,
      /UPDATE.*SET/i,
      /UNION.*SELECT/i,
    ];

    const isSuspicious = suspiciousPatterns.some(
      (pattern) => pattern.test(sanitizedEmail) || pattern.test(sanitizedPassword)
    );

    if (isSuspicious) {
      toast.error("Invalid input detected");
      console.warn("Suspicious login attempt detected:", { email: sanitizedEmail });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (error) throw error;

      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      // Don't expose detailed error messages to prevent information leakage
      const errorMessage = error.message?.includes("Invalid login credentials")
        ? "Invalid email or password"
        : "Failed to login. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error.message);
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
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch notices: ${error.message}`);
    }
  };

  const fetchEvents = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false });
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch events: ${error.message}`);
    }
  };

  const fetchGallery = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: false });
      if (error) throw error;
      setGallery(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch gallery: ${error.message}`);
    }
  };

  const deleteNotice = async (id: number) => {
    if (!supabase || !confirm("Are you sure you want to delete this notice?"))
      return;
    try {
      // First, get the notice to retrieve image URLs
      const { data: notice } = await supabase
        .from("notices")
        .select("poster_url, attachments")
        .eq("id", id)
        .single();

      // Delete from database
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;

      // Delete poster from storage
      if (notice?.poster_url) {
        await deleteImageFromSupabase(notice.poster_url);
        console.log("Deleted notice poster from storage");
      }

      // Delete attachments from storage (if they're stored as URLs, not base64)
      if (notice?.attachments && notice.attachments.length > 0) {
        const attachmentUrls = notice.attachments.map((att: any) => att.url);
        const { deletedCount } = await deleteMultipleImagesFromSupabase(attachmentUrls);
        console.log(`Deleted ${deletedCount} attachment(s) from storage`);
      }

      toast.success("Notice deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete notice: ${error.message}`);
    }
  };

  const toggleNoticeVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("notices")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(
        `Notice ${!currentHidden ? "hidden" : "visible"} successfully`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update notice visibility: ${error.message}`);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!supabase || !confirm("Are you sure you want to delete this event?"))
      return;
    try {
      // First, get the event to retrieve image URLs
      const { data: event } = await supabase
        .from("events")
        .select("poster_url, image_url")
        .eq("id", id)
        .single();

      // Delete from database
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;

      // Delete poster from storage
      if (event?.poster_url) {
        await deleteImageFromSupabase(event.poster_url);
        console.log("Deleted event poster from storage");
      }

      // Delete event image from storage
      if (event?.image_url) {
        await deleteImageFromSupabase(event.image_url);
        console.log("Deleted event image from storage");
      }

      toast.success("Event deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete event: ${error.message}`);
    }
  };

  const deleteGalleryItem = async (id: number) => {
    if (
      !supabase ||
      !confirm("Are you sure you want to delete this gallery item?")
    )
      return;
    try {
      // First, get the gallery item to retrieve image URLs
      const { data: item } = await supabase
        .from("gallery")
        .select("images")
        .eq("id", id)
        .single();

      // Delete from database
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;

      // Delete images from storage
      if (item?.images && item.images.length > 0) {
        const { deletedCount } = await deleteMultipleImagesFromSupabase(item.images);
        console.log(`Deleted ${deletedCount} image(s) from storage`);
      }

      toast.success("Gallery item deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete gallery item: ${error.message}`);
    }
  };

  const toggleGalleryVisibility = async (
    id: number,
    currentHidden: boolean
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(
        `Gallery item ${!currentHidden ? "hidden" : "visible"} successfully`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateGalleryOrder = async (id: number, newOrder: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
      toast.success("Gallery item order updated");
      setRefreshTrigger((prev) => prev + 1);
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
      const { data, error } = await supabase
        .from("members_faculty")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setFaculty(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch faculty: ${error.message}`);
    }
  };

  const fetchCoreTeam = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("members_core_team")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setCoreTeam(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch core team: ${error.message}`);
    }
  };

  const fetchPostHolders = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("members_post_holders")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setPostHolders(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch post holders: ${error.message}`);
    }
  };

  const fetchExecutive = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("members_executive")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setExecutive(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch executive team: ${error.message}`);
    }
  };

  const deleteMember = async (id: number, table: string, type: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete this ${type}?`))
      return;
    try {
      // First, get the member to retrieve image URL
      const { data: member } = await supabase
        .from(table)
        .select("image")
        .eq("id", id)
        .single();

      // Delete from database
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      // Delete image from storage
      if (member?.image) {
        await deleteImageFromSupabase(member.image);
        console.log("Deleted image from storage");
      }

      toast.success(`${type} deleted successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete ${type}: ${error.message}`);
    }
  };

  const toggleMemberVisibility = async (
    id: number,
    table: string,
    currentHidden: boolean,
    type: string
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from(table)
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(
        `${type} ${!currentHidden ? "hidden" : "visible"} successfully`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateMemberOrder = async (
    id: number,
    table: string,
    newOrder: number,
    type: string
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from(table)
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
      toast.success(`${type} order updated`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveMemberUp = (
    members: (Member | Faculty)[],
    index: number,
    table: string,
    type: string
  ) => {
    if (index === 0) return;
    const currentMember = members[index];
    const previousMember = members[index - 1];
    const currentOrder = currentMember.display_order || index;
    const previousOrder = previousMember.display_order || index - 1;
    updateMemberOrder(currentMember.id, table, previousOrder, type);
    updateMemberOrder(previousMember.id, table, currentOrder, type);
  };

  const moveMemberDown = (
    members: (Member | Faculty)[],
    index: number,
    table: string,
    type: string
  ) => {
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
      const { data, error } = await supabase
        .from("event_highlights")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setEventHighlights(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch event highlights: ${error.message}`);
    }
  };

  const deleteEventHighlight = async (id: number) => {
    if (
      !supabase ||
      !confirm("Are you sure you want to delete this event highlight?")
    )
      return;
    try {
      // First, get the highlight to retrieve image URLs
      const { data: highlight } = await supabase
        .from("event_highlights")
        .select("poster, highlights")
        .eq("id", id)
        .single();

      // Delete from database
      const { error } = await supabase
        .from("event_highlights")
        .delete()
        .eq("id", id);
      if (error) throw error;

      // Delete poster from storage
      if (highlight?.poster) {
        await deleteImageFromSupabase(highlight.poster);
        console.log("Deleted poster from storage");
      }

      // Delete highlight images from storage
      if (highlight?.highlights && highlight.highlights.length > 0) {
        const { deletedCount } = await deleteMultipleImagesFromSupabase(highlight.highlights);
        console.log(`Deleted ${deletedCount} highlight image(s) from storage`);
      }

      toast.success("Event highlight deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete event highlight: ${error.message}`);
    }
  };

  const toggleEventVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("events")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(
        `Event ${!currentHidden ? "hidden" : "visible"} successfully`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateEventOrder = async (
    id: number,
    newOrder: number,
    skipRefresh: boolean = false
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("events")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
      if (!skipRefresh) {
        toast.success("Event order updated");
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveEventUp = async (items: Event[], index: number) => {
    if (index === 0) return;
    const currentItem = items[index];
    const previousItem = items[index - 1];
    const currentOrder = currentItem.display_order ?? items.length - index;
    const previousOrder =
      previousItem.display_order ?? items.length - index + 1;
    await updateEventOrder(currentItem.id, previousOrder, true);
    await updateEventOrder(previousItem.id, currentOrder, true);
    toast.success("Event order updated");
    setRefreshTrigger((prev) => prev + 1);
  };

  const moveEventDown = async (items: Event[], index: number) => {
    if (index === items.length - 1) return;
    const currentItem = items[index];
    const nextItem = items[index + 1];
    const currentOrder = currentItem.display_order ?? items.length - index;
    const nextOrder = nextItem.display_order ?? items.length - index - 1;
    await updateEventOrder(currentItem.id, nextOrder, true);
    await updateEventOrder(nextItem.id, currentOrder, true);
    toast.success("Event order updated");
    setRefreshTrigger((prev) => prev + 1);
  };

  const toggleHighlightVisibility = async (
    id: number,
    currentHidden: boolean
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("event_highlights")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(
        `Highlight ${!currentHidden ? "hidden" : "visible"} successfully`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateHighlightOrder = async (
    id: number,
    newOrder: number,
    skipRefresh: boolean = false
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("event_highlights")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
      if (!skipRefresh) {
        toast.success("Highlight order updated");
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveHighlightUp = async (items: EventHighlight[], index: number) => {
    if (index === 0) return;
    const currentItem = items[index];
    const previousItem = items[index - 1];
    const currentOrder = currentItem.display_order ?? items.length - index;
    const previousOrder =
      previousItem.display_order ?? items.length - index + 1;
    await updateHighlightOrder(currentItem.id, previousOrder, true);
    await updateHighlightOrder(previousItem.id, currentOrder, true);
    toast.success("Highlight order updated");
    setRefreshTrigger((prev) => prev + 1);
  };

  const moveHighlightDown = async (items: EventHighlight[], index: number) => {
    if (index === items.length - 1) return;
    const currentItem = items[index];
    const nextItem = items[index + 1];
    const currentOrder = currentItem.display_order ?? items.length - index;
    const nextOrder = nextItem.display_order ?? items.length - index - 1;
    await updateHighlightOrder(currentItem.id, nextOrder, true);
    await updateHighlightOrder(nextItem.id, currentOrder, true);
    toast.success("Highlight order updated");
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchProjects = async () => {
    if (!supabase) return;
    try {
      const { data, error} = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch projects: ${error.message}`);
    }
  };

  const fetchChapterAwards = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("chapter_awards")
        .select("*")
        .order("year", { ascending: false })
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setChapterAwards(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch chapter awards: ${error.message}`);
    }
  };

  const fetchPastConvenors = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("past_convenors")
        .select("*")
        .order("tenure_start", { ascending: false })
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setPastConvenors(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch past convenors: ${error.message}`);
    }
  };

  const fetchStudentAchievements = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("student_achievements")
        .select("*")
        .order("date", { ascending: false })
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
      if (error) throw error;
      setStudentAchievements(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch student achievements: ${error.message}`);
    }
  };

  const deleteProject = async (id: number) => {
    if (!supabase || !confirm("Are you sure you want to delete this project?"))
      return;
    try {
      // First, get the project to retrieve image URL
      const { data: project } = await supabase
        .from("projects")
        .select("image_url")
        .eq("id", id)
        .single();

      // Delete from database
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      // Delete image from storage
      if (project?.image_url) {
        await deleteImageFromSupabase(project.image_url);
        console.log("Deleted project image from storage");
      }

      toast.success("Project deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  const deleteChapterAward = async (id: number) => {
    if (!supabase || !confirm("Are you sure you want to delete this award?"))
      return;
    try {
      const { data: award } = await supabase
        .from("chapter_awards")
        .select("certificate_image")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("chapter_awards").delete().eq("id", id);
      if (error) throw error;

      if (award?.certificate_image) {
        await deleteImageFromSupabase(award.certificate_image);
        console.log("Deleted award certificate from storage");
      }

      toast.success("Award deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete award: ${error.message}`);
    }
  };

  const deletePastConvenor = async (id: number) => {
    if (!supabase || !confirm("Are you sure you want to delete this convenor?"))
      return;
    try {
      const { data: convenor } = await supabase
        .from("past_convenors")
        .select("image")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("past_convenors").delete().eq("id", id);
      if (error) throw error;

      if (convenor?.image) {
        await deleteImageFromSupabase(convenor.image);
        console.log("Deleted convenor image from storage");
      }

      toast.success("Convenor deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete convenor: ${error.message}`);
    }
  };

  const deleteStudentAchievement = async (id: number) => {
    if (!supabase || !confirm("Are you sure you want to delete this achievement?"))
      return;
    try {
      const { data: achievement } = await supabase
        .from("student_achievements")
        .select("achievement_image")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("student_achievements").delete().eq("id", id);
      if (error) throw error;

      if (achievement?.achievement_image) {
        await deleteImageFromSupabase(achievement.achievement_image);
        console.log("Deleted achievement image from storage");
      }

      toast.success("Achievement deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to delete achievement: ${error.message}`);
    }
  };

  const toggleChapterAwardVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("chapter_awards")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Award ${!currentHidden ? "hidden" : "visible"} successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const togglePastConvenorVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("past_convenors")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Convenor ${!currentHidden ? "hidden" : "visible"} successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const toggleStudentAchievementVisibility = async (id: number, currentHidden: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("student_achievements")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Achievement ${!currentHidden ? "hidden" : "visible"} successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const toggleProjectVisibility = async (
    id: number,
    currentHidden: boolean
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ hidden: !currentHidden })
        .eq("id", id);
      if (error) throw error;
      toast.success(
        `Project ${!currentHidden ? "hidden" : "visible"} successfully`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  };

  const updateProjectOrder = async (
    id: number,
    newOrder: number,
    skipRefresh: boolean = false
  ) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
      if (!skipRefresh) {
        toast.success("Project order updated");
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const moveProjectUp = async (items: Project[], index: number) => {
    if (index === 0) return;
    const currentItem = items[index];
    const previousItem = items[index - 1];
    const currentOrder = currentItem.display_order ?? items.length - index;
    const previousOrder =
      previousItem.display_order ?? items.length - index + 1;
    await updateProjectOrder(currentItem.id, previousOrder, true);
    await updateProjectOrder(previousItem.id, currentOrder, true);
    toast.success("Project order updated");
    setRefreshTrigger((prev) => prev + 1);
  };

  const moveProjectDown = async (items: Project[], index: number) => {
    if (index === items.length - 1) return;
    const currentItem = items[index];
    const nextItem = items[index + 1];
    const currentOrder = currentItem.display_order ?? items.length - index;
    const nextOrder = nextItem.display_order ?? items.length - index - 1;
    await updateProjectOrder(currentItem.id, nextOrder, true);
    await updateProjectOrder(nextItem.id, currentOrder, true);
    toast.success("Project order updated");
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchSiteSettings = async () => {
    if (!supabase) return;
    try {
      const { data: projectsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "show_projects_in_navbar")
        .single();

      if (projectsData) {
        setShowProjectsInNavbar(projectsData.setting_value);
      }

      const { data: achievementsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "show_achievements_in_navbar")
        .single();

      if (achievementsData) {
        setShowAchievementsInNavbar(achievementsData.setting_value);
      }

      const { data: executiveData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "show_executive_team")
        .single();

      if (executiveData) {
        setShowExecutiveTeam(executiveData.setting_value);
      }

      const { data: noticeBoardData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "show_notice_board_on_home")
        .single();

      if (noticeBoardData) {
        setShowNoticeBoardOnHome(noticeBoardData.setting_value);
      }

      const { data: contactFormData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "contact_form_enabled")
        .single();

      if (contactFormData) {
        setContactFormEnabled(contactFormData.setting_value);
      }

      const { data: hideChapterAwardsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "hide_chapter_awards")
        .single();

      if (hideChapterAwardsData) {
        setHideChapterAwards(hideChapterAwardsData.setting_value);
      }

      const { data: hidePastConvenorsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "hide_past_convenors")
        .single();

      if (hidePastConvenorsData) {
        setHidePastConvenors(hidePastConvenorsData.setting_value);
      }

      const { data: hideStudentAchievementsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "hide_student_achievements")
        .single();

      if (hideStudentAchievementsData) {
        setHideStudentAchievements(hideStudentAchievementsData.setting_value);
      }
    } catch (error: any) {
      console.error("Error fetching site settings:", error);
    }
  };

  const updateNavbarSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "show_projects_in_navbar")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "show_projects_in_navbar");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "show_projects_in_navbar", setting_value: value },
          ]);
        if (error) throw error;
      }

      setShowProjectsInNavbar(value);
      toast.success(
        `Projects link ${value ? "shown in" : "hidden from"} navbar`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateAchievementsNavbarSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "show_achievements_in_navbar")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "show_achievements_in_navbar");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "show_achievements_in_navbar", setting_value: value },
          ]);
        if (error) throw error;
      }

      setShowAchievementsInNavbar(value);
      toast.success(
        `Achievements link ${value ? "shown in" : "hidden from"} navbar`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateExecutiveTeamSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "show_executive_team")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "show_executive_team");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "show_executive_team", setting_value: value },
          ]);
        if (error) throw error;
      }

      setShowExecutiveTeam(value);
      toast.success(
        `Executive Team section ${
          value ? "shown on" : "hidden from"
        } Members page`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateNoticeBoardSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "show_notice_board_on_home")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "show_notice_board_on_home");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "show_notice_board_on_home", setting_value: value },
          ]);
        if (error) throw error;
      }

      setShowNoticeBoardOnHome(value);
      toast.success(
        `Notice Board ${value ? "shown on" : "hidden from"} homepage`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateContactFormSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "contact_form_enabled")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "contact_form_enabled");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "contact_form_enabled", setting_value: value },
          ]);
        if (error) throw error;
      }

      setContactFormEnabled(value);
      toast.success(
        `Contact Form ${value ? "enabled" : "disabled"}`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateHideChapterAwardsSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "hide_chapter_awards")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "hide_chapter_awards");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "hide_chapter_awards", setting_value: value },
          ]);
        if (error) throw error;
      }

      setHideChapterAwards(value);
      toast.success(
        `Chapter Awards section ${value ? "hidden from" : "shown on"} website`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateHidePastConvenorsSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "hide_past_convenors")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "hide_past_convenors");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "hide_past_convenors", setting_value: value },
          ]);
        if (error) throw error;
      }

      setHidePastConvenors(value);
      toast.success(
        `Past Convenors section ${value ? "hidden from" : "shown on"} website`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  const updateHideStudentAchievementsSetting = async (value: boolean) => {
    if (!supabase) return;
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "hide_student_achievements")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", "hide_student_achievements");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([
            { setting_key: "hide_student_achievements", setting_value: value },
          ]);
        if (error) throw error;
      }

      setHideStudentAchievements(value);
      toast.success(
        `Student Achievements section ${value ? "hidden from" : "shown on"} website`
      );
    } catch (error: any) {
      toast.error(`Failed to update setting: ${error.message}`);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative z-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative z-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-destructive">
              Configuration Error
            </CardTitle>
            <CardDescription>
              Supabase is not properly configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              The application cannot connect to Supabase. Please ensure the
              following environment variables are set:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  VITE_SUPABASE_URL
                </code>{" "}
                - Your Supabase project URL
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  VITE_SUPABASE_ANON_KEY
                </code>{" "}
                - Your Supabase anonymous key
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              After adding the environment variables, restart the application
              for changes to take effect.
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative z-10">
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
                onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 sm:pt-24 pb-8 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Admin Panel
          </h1>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1 sm:flex-none text-xs sm:text-sm">
              Back to Home
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1 sm:flex-none text-xs sm:text-sm">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notices" className="w-full">
          <div className="w-full overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-auto min-w-full sm:w-full sm:grid sm:grid-cols-8 h-auto sm:h-10 gap-1 p-1">
              <TabsTrigger
                value="notices"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Notices
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Events
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="highlights"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Highlights
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Members
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Manage Notices
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Add, edit, or delete notices
                    </CardDescription>
                  </div>
                  <AddNoticeDialog
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                  />
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or type..."
                      value={noticesSearch}
                      onChange={(e) => setNoticesSearch(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Visible</TableHead>
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
                      .filter(
                        (notice) =>
                          notice.title
                            .toLowerCase()
                            .includes(noticesSearch.toLowerCase()) ||
                          notice.type
                            .toLowerCase()
                            .includes(noticesSearch.toLowerCase())
                      )
                      .map((notice) => (
                        <TableRow
                          key={notice.id}
                          className={notice.hidden ? "opacity-50" : ""}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleNoticeVisibility(
                                  notice.id,
                                  notice.hidden || false
                                )
                              }>
                              {notice.hidden ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>{notice.title}</TableCell>
                          <TableCell>{notice.date}</TableCell>
                          <TableCell>{convertTo12Hour(notice.time)}</TableCell>
                          <TableCell>{notice.type}</TableCell>
                          <TableCell>{notice.status}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <EditNoticeDialog
                                notice={notice}
                                onSuccess={() =>
                                  setRefreshTrigger((prev) => prev + 1)
                                }
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteNotice(notice.id)}>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Manage Events
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Add, edit, or delete events
                    </CardDescription>
                  </div>
                  <AddEventDialog
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                  />
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or location..."
                      value={eventsSearch}
                      onChange={(e) => setEventsSearch(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto scrollbar-hide">
                <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                        .filter(
                          (event) =>
                            event.title
                              .toLowerCase()
                              .includes(eventsSearch.toLowerCase()) ||
                            event.location
                              .toLowerCase()
                              .includes(eventsSearch.toLowerCase())
                        )
                        .map((event, index, filteredArray) => (
                          <TableRow
                            key={event.id}
                            className={event.hidden ? "opacity-50" : ""}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveEventUp(events, events.indexOf(event))
                                  }
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0">
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveEventDown(events, events.indexOf(event))
                                  }
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleEventVisibility(
                                    event.id,
                                    event.hidden || false
                                  )
                                }>
                                {event.hidden ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>{event.title}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>{event.status}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <EditEventDialog
                                  event={event}
                                  onSuccess={() =>
                                    setRefreshTrigger((prev) => prev + 1)
                                  }
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteEvent(event.id)}>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Manage Gallery
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Add, edit, or delete gallery items
                    </CardDescription>
                  </div>
                  <AddGalleryDialog
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                  />
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or category..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto scrollbar-hide">
                <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                        .filter(
                          (item) =>
                            item.title
                              .toLowerCase()
                              .includes(gallerySearch.toLowerCase()) ||
                            item.category
                              .toLowerCase()
                              .includes(gallerySearch.toLowerCase())
                        )
                        .map((item, index, filteredArray) => (
                          <TableRow
                            key={item.id}
                            className={item.hidden ? "opacity-50" : ""}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveGalleryUp(
                                      gallery,
                                      gallery.indexOf(item)
                                    )
                                  }
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0">
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveGalleryDown(
                                      gallery,
                                      gallery.indexOf(item)
                                    )
                                  }
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleGalleryVisibility(
                                    item.id,
                                    item.hidden || false
                                  )
                                }>
                                {item.hidden ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {item.images?.slice(0, 3).map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`${item.title} ${idx + 1}`}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ))}
                                {item.images?.length > 3 && (
                                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                                    +{item.images.length - 3}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <EditGalleryDialog
                                  item={item}
                                  onSuccess={() =>
                                    setRefreshTrigger((prev) => prev + 1)
                                  }
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteGalleryItem(item.id)}>
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

          <TabsContent value="achievements">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Chapter Awards</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Manage annual best chapter awards</CardDescription>
                    </div>
                    <AddChapterAwardDialog onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title or year..."
                        value={chapterAwardsSearch}
                        onChange={(e) => setChapterAwardsSearch(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto scrollbar-hide">
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chapterAwards
                          .filter((award) =>
                            award.award_title.toLowerCase().includes(chapterAwardsSearch.toLowerCase()) ||
                            award.year.includes(chapterAwardsSearch)
                          )
                          .map((award) => (
                            <TableRow key={award.id} className={award.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleChapterAwardVisibility(award.id, award.hidden || false)}
                                >
                                  {award.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{award.year}</TableCell>
                              <TableCell>{award.award_title}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditChapterAwardDialog award={award} onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteChapterAward(award.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {chapterAwards.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No awards yet. Click "Add Chapter Award" to create one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Past Convenors</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Manage past convenor profiles</CardDescription>
                    </div>
                    <AddPastConvenorDialog onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name..."
                        value={pastConvenorsSearch}
                        onChange={(e) => setPastConvenorsSearch(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto scrollbar-hide">
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Tenure</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastConvenors
                          .filter((convenor) =>
                            convenor.name.toLowerCase().includes(pastConvenorsSearch.toLowerCase())
                          )
                          .map((convenor) => (
                            <TableRow key={convenor.id} className={convenor.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePastConvenorVisibility(convenor.id, convenor.hidden || false)}
                                >
                                  {convenor.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                              <TableCell>{convenor.name}</TableCell>
                              <TableCell className="font-mono text-sm">{convenor.tenure_start} - {convenor.tenure_end}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditPastConvenorDialog convenor={convenor} onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deletePastConvenor(convenor.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {pastConvenors.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No convenors yet. Click "Add Past Convenor" to create one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Student Achievements</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Manage student achievement records</CardDescription>
                    </div>
                    <AddStudentAchievementDialog onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by student name or event..."
                        value={studentAchievementsSearch}
                        onChange={(e) => setStudentAchievementsSearch(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto scrollbar-hide">
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Visible</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentAchievements
                          .filter((achievement) =>
                            achievement.student_name.toLowerCase().includes(studentAchievementsSearch.toLowerCase()) ||
                            achievement.event_name.toLowerCase().includes(studentAchievementsSearch.toLowerCase())
                          )
                          .map((achievement) => (
                            <TableRow key={achievement.id} className={achievement.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleStudentAchievementVisibility(achievement.id, achievement.hidden || false)}
                                >
                                  {achievement.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                              <TableCell>{achievement.student_name}</TableCell>
                              <TableCell>{achievement.event_name}</TableCell>
                              <TableCell className="font-mono text-sm">{achievement.position}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditStudentAchievementDialog achievement={achievement} onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteStudentAchievement(achievement.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {studentAchievements.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              No achievements yet. Click "Add Student Achievement" to create one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        Faculty
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Manage faculty advisors
                      </CardDescription>
                    </div>
                    <AddFacultyDialog
                      onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or title..."
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto scrollbar-hide">
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                          .filter(
                            (member) =>
                              member.name
                                .toLowerCase()
                                .includes(facultySearch.toLowerCase()) ||
                              member.title
                                .toLowerCase()
                                .includes(facultySearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                            <TableRow
                              key={member.id}
                              className={member.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberUp(
                                        faculty,
                                        faculty.indexOf(member),
                                        "members_faculty",
                                        "faculty"
                                      )
                                    }
                                    disabled={index === 0}
                                    className="h-6 w-6 p-0">
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberDown(
                                        faculty,
                                        faculty.indexOf(member),
                                        "members_faculty",
                                        "faculty"
                                      )
                                    }
                                    disabled={
                                      index === filteredArray.length - 1
                                    }
                                    className="h-6 w-6 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleMemberVisibility(
                                      member.id,
                                      "members_faculty",
                                      member.hidden || false,
                                      "faculty"
                                    )
                                  }>
                                  {member.hidden ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>{member.title}</TableCell>
                              <TableCell>
                                <img
                                  src={member.image || "/default-avatar.png"}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-avatar.png";
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditFacultyDialog
                                    member={member}
                                    onSuccess={() =>
                                      setRefreshTrigger((prev) => prev + 1)
                                    }
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      deleteMember(
                                        member.id,
                                        "members_faculty",
                                        "faculty member"
                                      )
                                    }>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        Core Team
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Manage core team members
                      </CardDescription>
                    </div>
                    <AddMemberDialog
                      table="members_core_team"
                      title="Add Core Team Member"
                      onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or position..."
                        value={coreTeamSearch}
                        onChange={(e) => setCoreTeamSearch(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto scrollbar-hide">
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                          .filter(
                            (member) =>
                              member.name
                                .toLowerCase()
                                .includes(coreTeamSearch.toLowerCase()) ||
                              member.position
                                .toLowerCase()
                                .includes(coreTeamSearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                            <TableRow
                              key={member.id}
                              className={member.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberUp(
                                        coreTeam,
                                        coreTeam.indexOf(member),
                                        "members_core_team",
                                        "core team member"
                                      )
                                    }
                                    disabled={index === 0}
                                    className="h-6 w-6 p-0">
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberDown(
                                        coreTeam,
                                        coreTeam.indexOf(member),
                                        "members_core_team",
                                        "core team member"
                                      )
                                    }
                                    disabled={
                                      index === filteredArray.length - 1
                                    }
                                    className="h-6 w-6 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleMemberVisibility(
                                      member.id,
                                      "members_core_team",
                                      member.hidden || false,
                                      "core team member"
                                    )
                                  }>
                                  {member.hidden ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                <img
                                  src={member.image || "/default-avatar.png"}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-avatar.png";
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditMemberDialog
                                    member={member}
                                    table="members_core_team"
                                    title="Edit Core Team Member"
                                    onSuccess={() =>
                                      setRefreshTrigger((prev) => prev + 1)
                                    }
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      deleteMember(
                                        member.id,
                                        "members_core_team",
                                        "core team member"
                                      )
                                    }>
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
                    <AddMemberDialog
                      table="members_post_holders"
                      title="Add Post Holder"
                      onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                    />
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
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                          .filter(
                            (member) =>
                              member.name
                                .toLowerCase()
                                .includes(postHoldersSearch.toLowerCase()) ||
                              member.position
                                .toLowerCase()
                                .includes(postHoldersSearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                            <TableRow
                              key={member.id}
                              className={member.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberUp(
                                        postHolders,
                                        postHolders.indexOf(member),
                                        "members_post_holders",
                                        "post holder"
                                      )
                                    }
                                    disabled={index === 0}
                                    className="h-6 w-6 p-0">
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberDown(
                                        postHolders,
                                        postHolders.indexOf(member),
                                        "members_post_holders",
                                        "post holder"
                                      )
                                    }
                                    disabled={
                                      index === filteredArray.length - 1
                                    }
                                    className="h-6 w-6 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleMemberVisibility(
                                      member.id,
                                      "members_post_holders",
                                      member.hidden || false,
                                      "post holder"
                                    )
                                  }>
                                  {member.hidden ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                <img
                                  src={member.image || "/default-avatar.png"}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-avatar.png";
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditMemberDialog
                                    member={member}
                                    table="members_post_holders"
                                    title="Edit Post Holder"
                                    onSuccess={() =>
                                      setRefreshTrigger((prev) => prev + 1)
                                    }
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      deleteMember(
                                        member.id,
                                        "members_post_holders",
                                        "post holder"
                                      )
                                    }>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        Executive Team
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Manage executive team members
                      </CardDescription>
                    </div>
                    <AddMemberDialog
                      table="members_executive"
                      title="Add Executive Member"
                      onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or position..."
                        value={executiveSearch}
                        onChange={(e) => setExecutiveSearch(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto scrollbar-hide">
                  <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                          .filter(
                            (member) =>
                              member.name
                                .toLowerCase()
                                .includes(executiveSearch.toLowerCase()) ||
                              member.position
                                .toLowerCase()
                                .includes(executiveSearch.toLowerCase())
                          )
                          .map((member, index, filteredArray) => (
                            <TableRow
                              key={member.id}
                              className={member.hidden ? "opacity-50" : ""}>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberUp(
                                        executive,
                                        executive.indexOf(member),
                                        "members_executive",
                                        "executive member"
                                      )
                                    }
                                    disabled={index === 0}
                                    className="h-6 w-6 p-0">
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      moveMemberDown(
                                        executive,
                                        executive.indexOf(member),
                                        "members_executive",
                                        "executive member"
                                      )
                                    }
                                    disabled={
                                      index === filteredArray.length - 1
                                    }
                                    className="h-6 w-6 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleMemberVisibility(
                                      member.id,
                                      "members_executive",
                                      member.hidden || false,
                                      "executive member"
                                    )
                                  }>
                                  {member.hidden ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                <img
                                  src={member.image || "/default-avatar.png"}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-avatar.png";
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <EditMemberDialog
                                    member={member}
                                    table="members_executive"
                                    title="Edit Executive Member"
                                    onSuccess={() =>
                                      setRefreshTrigger((prev) => prev + 1)
                                    }
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      deleteMember(
                                        member.id,
                                        "members_executive",
                                        "executive member"
                                      )
                                    }>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Manage Event Highlights
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Add, edit, or delete past event highlights
                    </CardDescription>
                  </div>
                  <AddEventHighlightDialog
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                  />
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or location..."
                      value={highlightsSearch}
                      onChange={(e) => setHighlightsSearch(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto scrollbar-hide">
                <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                        .filter(
                          (highlight) =>
                            highlight.title
                              .toLowerCase()
                              .includes(highlightsSearch.toLowerCase()) ||
                            highlight.location
                              .toLowerCase()
                              .includes(highlightsSearch.toLowerCase())
                        )
                        .map((highlight, index, filteredArray) => (
                          <TableRow
                            key={highlight.id}
                            className={highlight.hidden ? "opacity-50" : ""}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveHighlightUp(
                                      eventHighlights,
                                      eventHighlights.indexOf(highlight)
                                    )
                                  }
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0">
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveHighlightDown(
                                      eventHighlights,
                                      eventHighlights.indexOf(highlight)
                                    )
                                  }
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleHighlightVisibility(
                                    highlight.id,
                                    highlight.hidden || false
                                  )
                                }>
                                {highlight.hidden ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>{highlight.title}</TableCell>
                            <TableCell>{highlight.date}</TableCell>
                            <TableCell>{highlight.location}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <EditEventHighlightDialog
                                  highlight={highlight}
                                  onSuccess={() =>
                                    setRefreshTrigger((prev) => prev + 1)
                                  }
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    deleteEventHighlight(highlight.id)
                                  }>
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

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Manage Projects
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Add, edit, or delete projects
                    </CardDescription>
                  </div>
                  <AddProjectDialog
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                  />
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or category..."
                      value={projectsSearch}
                      onChange={(e) => setProjectsSearch(e.target.value)}
                      className="pl-8 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto scrollbar-hide">
                <div className="max-h-96 overflow-y-auto scrollbar-hide">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Order</TableHead>
                        <TableHead className="w-12">Visible</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects
                        .filter(
                          (project) =>
                            project.title
                              .toLowerCase()
                              .includes(projectsSearch.toLowerCase()) ||
                            project.category
                              .toLowerCase()
                              .includes(projectsSearch.toLowerCase())
                        )
                        .map((project, index, filteredArray) => (
                          <TableRow
                            key={project.id}
                            className={project.hidden ? "opacity-50" : ""}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveProjectUp(
                                      projects,
                                      projects.indexOf(project)
                                    )
                                  }
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0">
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    moveProjectDown(
                                      projects,
                                      projects.indexOf(project)
                                    )
                                  }
                                  disabled={index === filteredArray.length - 1}
                                  className="h-6 w-6 p-0">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleProjectVisibility(
                                    project.id,
                                    project.hidden || false
                                  )
                                }>
                                {project.hidden ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <EditProjectDialog
                                  project={project}
                                  onSuccess={() =>
                                    setRefreshTrigger((prev) => prev + 1)
                                  }
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteProject(project.id)}>
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

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Site Settings
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Configure website appearance and functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">Show Projects in Navbar</h3>
                    <p className="text-sm text-muted-foreground">
                      Display the Projects link in the main navigation bar
                    </p>
                  </div>
                  <Button
                    variant={showProjectsInNavbar ? "default" : "outline"}
                    onClick={() => updateNavbarSetting(!showProjectsInNavbar)}>
                    {showProjectsInNavbar ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">Show Achievements in Navbar</h3>
                    <p className="text-sm text-muted-foreground">
                      Display the Achievements link in the main navigation bar
                    </p>
                  </div>
                  <Button
                    variant={showAchievementsInNavbar ? "default" : "outline"}
                    onClick={() => updateAchievementsNavbarSetting(!showAchievementsInNavbar)}>
                    {showAchievementsInNavbar ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      Show Executive Team in Members
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Display the Executive Team section on the Members page
                    </p>
                  </div>
                  <Button
                    variant={showExecutiveTeam ? "default" : "outline"}
                    onClick={() =>
                      updateExecutiveTeamSetting(!showExecutiveTeam)
                    }>
                    {showExecutiveTeam ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      Show Notice Board on Homepage
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Display the Notice Board section on the homepage
                    </p>
                  </div>
                  <Button
                    variant={showNoticeBoardOnHome ? "default" : "outline"}
                    onClick={() =>
                      updateNoticeBoardSetting(!showNoticeBoardOnHome)
                    }>
                    {showNoticeBoardOnHome ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      Contact Form Enabled
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable the contact form (useful during maintenance)
                    </p>
                  </div>
                  <Button
                    variant={contactFormEnabled ? "default" : "outline"}
                    onClick={() =>
                      updateContactFormSetting(!contactFormEnabled)
                    }>
                    {contactFormEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div>
                    <h3 className="font-medium mb-1">Achievements Page Sections</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control visibility of individual sections on the Achievements page
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Chapter Awards</h4>
                      <p className="text-xs text-muted-foreground">
                        Show/hide Chapter Awards section
                      </p>
                    </div>
                    <Button
                      variant={hideChapterAwards ? "destructive" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateHideChapterAwardsSetting(!hideChapterAwards)
                      }>
                      {hideChapterAwards ? "Hidden" : "Visible"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Past Convenors</h4>
                      <p className="text-xs text-muted-foreground">
                        Show/hide Past Convenors section
                      </p>
                    </div>
                    <Button
                      variant={hidePastConvenors ? "destructive" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateHidePastConvenorsSetting(!hidePastConvenors)
                      }>
                      {hidePastConvenors ? "Hidden" : "Visible"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Student Achievements</h4>
                      <p className="text-xs text-muted-foreground">
                        Show/hide Student Achievements section
                      </p>
                    </div>
                    <Button
                      variant={hideStudentAchievements ? "destructive" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateHideStudentAchievementsSetting(!hideStudentAchievements)
                      }>
                      {hideStudentAchievements ? "Hidden" : "Visible"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// SelectWithOther component for dropdowns with custom "other" option
function SelectWithOther({
  label,
  id,
  value,
  options,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  // Check if current value is not in predefined options
  useEffect(() => {
    const isPredefined = options.some((opt) => opt.value === value);
    if (!isPredefined && value) {
      setShowOtherInput(true);
      setOtherValue(value);
    }
  }, [value, options]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "other") {
      setShowOtherInput(true);
      setOtherValue("");
    } else {
      setShowOtherInput(false);
      setOtherValue("");
      onChange(selectedValue);
    }
  };

  const handleOtherInputChange = (inputValue: string) => {
    setOtherValue(inputValue);
    onChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={showOtherInput ? "other" : value}
        onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          <SelectItem value="other">Other (type your own)</SelectItem>
        </SelectContent>
      </Select>
      {showOtherInput && (
        <Input
          id={`${id}-other`}
          value={otherValue}
          onChange={(e) => handleOtherInputChange(e.target.value)}
          placeholder="Enter custom value"
          required
          className="mt-2"
        />
      )}
    </div>
  );
}

function AddNoticeDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    type: "EVENT",
    status: "UPCOMING",
    description: "",
    rich_description: "",
    poster_url: "",
    attachments: [] as { name: string; url: string; type: string }[],
    external_link: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeInput, setTimeInput] = useState("");

  // Auto-populate current date and time when dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      setSelectedDate(now);

      const dateStr = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }); // 12-hour format

      setTimeInput(timeStr);
      setFormData((prev) => ({
        ...prev,
        date: dateStr,
        time: timeStr,
      }));
    }
  }, [open]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
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
      // Auto-populate basic description from rich_description if empty
      const submitData = {
        ...formData,
        description:
          formData.description ||
          formData.rich_description
            ?.replace(/<[^>]*>/g, "")
            .substring(0, 200) ||
          "No description",
      };

      const { error } = await supabase.from("notices").insert([submitData]);
      if (error) throw error;
      toast.success("Notice added successfully");
      setOpen(false);
      setFormData({
        title: "",
        date: "",
        time: "",
        type: "EVENT",
        status: "UPCOMING",
        description: "",
        rich_description: "",
        poster_url: "",
        attachments: [],
        external_link: "",
      });
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
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Notice</DialogTitle>
          <DialogDescription>
            Create a new notice for the notice board
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={timeInput}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectWithOther
                label="Type"
                id="type"
                value={formData.type}
                options={[
                  { value: "EVENT", label: "EVENT" },
                  { value: "ANNOUNCEMENT", label: "ANNOUNCEMENT" },
                  { value: "WORKSHOP", label: "WORKSHOP" },
                ]}
                onChange={(value) => setFormData({ ...formData, type: value })}
              />
              <SelectWithOther
                label="Status"
                id="status"
                value={formData.status}
                options={[
                  { value: "UPCOMING", label: "UPCOMING" },
                  { value: "REGISTRATION", label: "REGISTRATION" },
                  { value: "SCHEDULED", label: "SCHEDULED" },
                ]}
                onChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              />
            </div>
            <div>
              <Label htmlFor="rich-description">
                Description (with formatting)
              </Label>
              <RichTextEditor
                value={formData.rich_description || ""}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    rich_description: value,
                    description:
                      value.replace(/<[^>]*>/g, "").substring(0, 200) ||
                      "No description",
                  })
                }
                placeholder="Add your notice content with bold, links, and lists..."
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use bold text, add links, and create lists. This will show in
                cards and full notice page.
              </p>
            </div>
            <FileUploadField
              label="Event Poster / Banner"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              value={formData.poster_url}
              onChange={(url) => setFormData({ ...formData, poster_url: url })}
              onClear={() => setFormData({ ...formData, poster_url: "" })}
              description="Upload event poster (JPG/PNG/WEBP, max 5MB)"
              preview={true}
            />
            <MultipleFileUpload
              label="Attachments"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              value={formData.attachments}
              onChange={(attachments) =>
                setFormData({ ...formData, attachments })
              }
              description="Upload PDFs, registration forms, Excel sheets, etc. (max 5 files)"
              maxFiles={5}
            />
            <DialogFooter>
              <Button type="submit">Add Notice</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditNoticeDialog({
  notice,
  onSuccess,
}: {
  notice: Notice;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(notice);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeInput, setTimeInput] = useState(
    convertTo12Hour(notice.time || "")
  );

  // Initialize time input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeInput(convertTo12Hour(notice.time || ""));
    }
  }, [open, notice.time]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
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
      // Auto-populate basic description from rich_description if empty
      const submitData = {
        ...formData,
        description:
          formData.description ||
          formData.rich_description
            ?.replace(/<[^>]*>/g, "")
            .substring(0, 200) ||
          "No description",
      };

      const { error } = await supabase
        .from("notices")
        .update(submitData)
        .eq("id", notice.id);
      if (error) throw error;
      toast.success("Notice updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update notice: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
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
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    setSelectedDate(e.target.value ? new Date(e.target.value) : undefined);
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={timeInput}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectWithOther
                label="Type"
                id="edit-type"
                value={formData.type}
                options={[
                  { value: "EVENT", label: "EVENT" },
                  { value: "ANNOUNCEMENT", label: "ANNOUNCEMENT" },
                  { value: "WORKSHOP", label: "WORKSHOP" },
                ]}
                onChange={(value) => setFormData({ ...formData, type: value })}
              />
              <SelectWithOther
                label="Status"
                id="edit-status"
                value={formData.status}
                options={[
                  { value: "UPCOMING", label: "UPCOMING" },
                  { value: "REGISTRATION", label: "REGISTRATION" },
                  { value: "SCHEDULED", label: "SCHEDULED" },
                ]}
                onChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-rich-description">
                Description (with formatting)
              </Label>
              <RichTextEditor
                value={formData.rich_description || ""}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    rich_description: value,
                    description:
                      value.replace(/<[^>]*>/g, "").substring(0, 200) ||
                      "No description",
                  })
                }
                placeholder="Add your notice content with bold, links, and lists..."
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use bold text, add links, and create lists. This will show in
                cards and full notice page.
              </p>
            </div>
            <FileUploadField
              label="Event Poster / Banner"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              value={formData.poster_url || ""}
              onChange={(url) => setFormData({ ...formData, poster_url: url })}
              onClear={() => setFormData({ ...formData, poster_url: "" })}
              description="Upload event poster (JPG/PNG/WEBP, max 5MB)"
              preview={true}
            />
            <MultipleFileUpload
              label="Attachments"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              value={formData.attachments || []}
              onChange={(attachments) =>
                setFormData({ ...formData, attachments })
              }
              description="Upload PDFs, registration forms, Excel sheets, etc. (max 5 files)"
              maxFiles={5}
            />
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
    agenda: [],
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      setFormData({ ...formData, date: dateStr });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { data: maxOrderData } = await supabase
        .from("events")
        .select("display_order")
        .order("display_order", { ascending: false, nullsFirst: false })
        .limit(1)
        .single();

      const newDisplayOrder = (maxOrderData?.display_order ?? 0) + 1;

      const { error } = await supabase
        .from("events")
        .insert([{ ...formData, display_order: newDisplayOrder }]);
      if (error) throw error;
      toast.success("Event added successfully");
      setOpen(false);
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        status: "UPCOMING",
        capacity: "100",
        organizer: "ISTE GNDEC",
        details: "",
        agenda: [],
      });
      setSelectedDate(undefined);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add event: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Event
        </Button>
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
              <Input
                id="event-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="event-time">Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectWithOther
                label="Status"
                id="event-status"
                value={formData.status}
                options={[
                  { value: "UPCOMING", label: "UPCOMING" },
                  { value: "ONGOING", label: "ONGOING" },
                  { value: "COMPLETED", label: "COMPLETED" },
                ]}
                onChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              />
              <div>
                <Label htmlFor="event-capacity">Capacity</Label>
                <Input
                  id="event-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  placeholder="100"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="event-organizer">Organizer</Label>
              <Input
                id="event-organizer"
                value={formData.organizer}
                onChange={(e) =>
                  setFormData({ ...formData, organizer: e.target.value })
                }
                placeholder="ISTE GNDEC"
              />
            </div>
            <div>
              <Label htmlFor="event-details">Details</Label>
              <Textarea
                id="event-details"
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                placeholder="Additional event details"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="event-agenda">Agenda (one item per line)</Label>
              <Textarea
                id="event-agenda"
                value={formData.agenda.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agenda: e.target.value
                      .split("\n")
                      .filter((line) => line.trim()),
                  })
                }
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

function EditEventDialog({
  event,
  onSuccess,
}: {
  event: Event;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(event);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
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
      const { error } = await supabase
        .from("events")
        .update(formData)
        .eq("id", event.id);
      if (error) throw error;
      toast.success("Event updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update event: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update event information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <form
            id="edit-event-form"
            onSubmit={handleSubmit}
            className="space-y-4 pb-2">
            <div>
              <Label htmlFor="edit-event-title">Title</Label>
              <Input
                id="edit-event-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-event-date">Date</Label>
                <Input
                  id="edit-event-date"
                  type="date"
                  value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    setSelectedDate(e.target.value ? new Date(e.target.value) : undefined);
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-event-time">Time</Label>
                <Input
                  id="edit-event-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-event-location">Location</Label>
              <Input
                id="edit-event-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-event-description">Description</Label>
              <Textarea
                id="edit-event-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectWithOther
                label="Status"
                id="edit-event-status"
                value={formData.status}
                options={[
                  { value: "UPCOMING", label: "UPCOMING" },
                  { value: "ONGOING", label: "ONGOING" },
                  { value: "COMPLETED", label: "COMPLETED" },
                ]}
                onChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              />
              <div>
                <Label htmlFor="edit-event-capacity">Capacity</Label>
                <Input
                  id="edit-event-capacity"
                  type="number"
                  value={formData.capacity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  placeholder="100"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-event-organizer">Organizer</Label>
              <Input
                id="edit-event-organizer"
                value={formData.organizer || ""}
                onChange={(e) =>
                  setFormData({ ...formData, organizer: e.target.value })
                }
                placeholder="ISTE GNDEC"
              />
            </div>
            <div>
              <Label htmlFor="edit-event-details">Details</Label>
              <Textarea
                id="edit-event-details"
                value={formData.details || ""}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                placeholder="Additional event details"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-event-agenda">
                Agenda (one item per line)
              </Label>
              <Textarea
                id="edit-event-agenda"
                value={formData.agenda?.join("\n") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agenda: e.target.value
                      .split("\n")
                      .filter((line) => line.trim()),
                  })
                }
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
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const form = document.getElementById(
                "edit-event-form"
              ) as HTMLFormElement;
              if (form) form.requestSubmit();
            }}>
            Update Event
          </Button>
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
    category: "event",
    description: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log(`Selected ${files.length} file(s)`);

    setUploading(true);
    const fileArray = Array.from(files);
    console.log(
      "Files to upload:",
      fileArray.map((f) => f.name)
    );

    const { urls, errors } = await uploadMultipleImages(fileArray, "gallery");
    setUploading(false);

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    if (urls.length > 0) {
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success(`${urls.length} image(s) uploaded successfully`);
    }

    e.target.value = "";
  };

  const removeImage = async (index: number) => {
    const imageUrl = uploadedImages[index];
    
    // Delete from storage
    if (imageUrl) {
      await deleteImageFromSupabase(imageUrl);
      console.log("Deleted image from storage");
    }
    
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...uploadedImages];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    setUploadedImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === uploadedImages.length - 1) return;
    const newImages = [...uploadedImages];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
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
        description: formData.description,
      };

      const { error } = await supabase.from("gallery").insert([galleryItem]);
      if (error) throw error;

      toast.success(
        `Gallery item added with ${uploadedImages.length} image(s)`
      );
      setOpen(false);
      setFormData({ title: "", category: "event", description: "" });
      setUploadedImages([]);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add gallery item: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Gallery Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[85vh] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Gallery Items</DialogTitle>
          <DialogDescription>
            Add one or more images to the gallery
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-2 sm:pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="gallery-image">Upload Images (Multiple)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                💡 Tip: Hold Ctrl (Windows) or Cmd (Mac) to select multiple
                images at once
              </p>
              <Input
                id="gallery-image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {uploadedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90"
                            title="Move left">
                            <ChevronUp className="h-3 w-3" />
                          </button>
                        )}
                        {index < uploadedImages.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90"
                            title="Move right">
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          title="Remove">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
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
            <SelectWithOther
              label="Category"
              id="gallery-category"
              value={formData.category}
              options={[
                { value: "event", label: "Event" },
                { value: "workshop", label: "Workshop" },
              ]}
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            />
            <div>
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={uploading || uploadedImages.length === 0}>
            Add {uploadedImages.length > 0 ? `${uploadedImages.length} ` : ""}
            Gallery Item{uploadedImages.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditGalleryDialog({
  item,
  onSuccess,
}: {
  item: GalleryItem;
  onSuccess: () => void;
}) {
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
    console.log(
      "Files to upload:",
      fileArray.map((f) => f.name)
    );

    const { urls, errors } = await uploadMultipleImages(fileArray, "gallery");
    setUploading(false);

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    if (urls.length > 0) {
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success(`${urls.length} image(s) uploaded successfully`);
    }

    e.target.value = "";
  };

  const removeImage = async (index: number) => {
    const imageUrl = uploadedImages[index];
    
    // Delete from storage
    if (imageUrl) {
      await deleteImageFromSupabase(imageUrl);
      console.log("Deleted image from storage");
    }
    
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...uploadedImages];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    setUploadedImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === uploadedImages.length - 1) return;
    const newImages = [...uploadedImages];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    setUploadedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      // Update the gallery item with all images
      const updatedData = {
        ...formData,
        images: uploadedImages,
      };

      const { error } = await supabase
        .from("gallery")
        .update(updatedData)
        .eq("id", item.id);
      if (error) throw error;

      toast.success(
        `Gallery item updated with ${uploadedImages.length} image(s)`
      );
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
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
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
              <Input
                id="edit-gallery-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-gallery-image">Images</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Upload new images or manage existing ones. You can reorder
                images by using the up/down arrows.
              </p>
              <Input
                id="edit-gallery-image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {uploadedImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Images ({uploadedImages.length}):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImageUp(index)}
                              className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90"
                              title="Move left">
                              <ChevronUp className="h-3 w-3" />
                            </button>
                          )}
                          {index < uploadedImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImageDown(index)}
                              className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90"
                              title="Move right">
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                            title="Remove">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <SelectWithOther
              label="Category"
              id="edit-gallery-category"
              value={formData.category}
              options={[
                { value: "event", label: "Event" },
                { value: "workshop", label: "Workshop" },
              ]}
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            />
            <div>
              <Label htmlFor="edit-gallery-description">Description</Label>
              <Textarea
                id="edit-gallery-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={uploading}>
            Update Gallery Item
          </Button>
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
    instagram: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "faculty");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
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
        ...(formData.linkedin && { linkedin: normalizeUrl(formData.linkedin) }),
        ...(formData.github && { github: normalizeUrl(formData.github) }),
        ...(formData.instagram && {
          instagram: normalizeUrl(formData.instagram),
        }),
      };
      const { error } = await supabase
        .from("members_faculty")
        .insert([dataToInsert]);
      if (error) throw error;
      toast.success("Faculty member added successfully");
      setOpen(false);
      setFormData({
        name: "",
        title: "",
        image: "",
        description: "",
        linkedin: "",
        github: "",
        instagram: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add faculty: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Faculty
        </Button>
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
              <Input
                id="faculty-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="faculty-title">Title</Label>
              <Input
                id="faculty-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="faculty-image">Profile Image</Label>
              <Input
                id="faculty-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <Label htmlFor="faculty-description">Description</Label>
              <Textarea
                id="faculty-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="faculty-linkedin">LinkedIn URL (optional)</Label>
              <Input
                id="faculty-linkedin"
                type="text"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="faculty-github">GitHub URL (optional)</Label>
              <Input
                id="faculty-github"
                type="text"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="github.com/username"
              />
            </div>
            <div>
              <Label htmlFor="faculty-instagram">
                Instagram URL (optional)
              </Label>
              <Input
                id="faculty-instagram"
                type="text"
                value={formData.instagram}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                placeholder="instagram.com/username"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading || !formData.image}>
                Add Faculty
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditFacultyDialog({
  member,
  onSuccess,
}: {
  member: Faculty;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(member);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldImage = formData.image;
    
    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "faculty");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      // Delete old image from storage
      if (oldImage) {
        await deleteImageFromSupabase(oldImage);
        console.log("Deleted old faculty image from storage");
      }
      
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const dataToUpdate = {
        ...formData,
        linkedin: formData.linkedin
          ? normalizeUrl(formData.linkedin)
          : formData.linkedin,
        github: formData.github
          ? normalizeUrl(formData.github)
          : formData.github,
        instagram: formData.instagram
          ? normalizeUrl(formData.instagram)
          : formData.instagram,
      };
      const { error } = await supabase
        .from("members_faculty")
        .update(dataToUpdate)
        .eq("id", member.id);
      if (error) throw error;
      toast.success("Faculty member updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update faculty: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
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
              <Input
                id="edit-faculty-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-faculty-title">Title</Label>
              <Input
                id="edit-faculty-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-faculty-image">Profile Image</Label>
              <Input
                id="edit-faculty-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <Label htmlFor="edit-faculty-description">Description</Label>
              <Textarea
                id="edit-faculty-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-faculty-linkedin">
                LinkedIn URL (optional)
              </Label>
              <Input
                id="edit-faculty-linkedin"
                type="text"
                value={formData.linkedin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="edit-faculty-github">GitHub URL (optional)</Label>
              <Input
                id="edit-faculty-github"
                type="text"
                value={formData.github || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="github.com/username"
              />
            </div>
            <div>
              <Label htmlFor="edit-faculty-instagram">
                Instagram URL (optional)
              </Label>
              <Input
                id="edit-faculty-instagram"
                type="text"
                value={formData.instagram || ""}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                placeholder="instagram.com/username"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                Update Faculty
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddMemberDialog({
  table,
  title,
  onSuccess,
}: {
  table: string;
  title: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: "",
    email: "",
    linkedin: "",
    github: "",
    instagram: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "members");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const dataToInsert = {
        name: formData.name,
        position: formData.position,
        image: formData.image || "/default-avatar.png",
        ...(formData.email && { email: formData.email }),
        ...(formData.linkedin && { linkedin: normalizeUrl(formData.linkedin) }),
        ...(formData.github && { github: normalizeUrl(formData.github) }),
        ...(formData.instagram && {
          instagram: normalizeUrl(formData.instagram),
        }),
      };
      const { error } = await supabase.from(table).insert([dataToInsert]);
      if (error) throw error;
      toast.success("Member added successfully");
      setOpen(false);
      setFormData({
        name: "",
        position: "",
        image: "",
        email: "",
        linkedin: "",
        github: "",
        instagram: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add member: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Member
        </Button>
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
              <Input
                id="member-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="member-position">Position</Label>
              <Input
                id="member-position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="member-email">Email (optional)</Label>
              <Input
                id="member-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="member-linkedin">LinkedIn URL (optional)</Label>
              <Input
                id="member-linkedin"
                type="text"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="member-github">GitHub URL (optional)</Label>
              <Input
                id="member-github"
                type="text"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="github.com/username"
              />
            </div>
            <div>
              <Label htmlFor="member-instagram">Instagram URL (optional)</Label>
              <Input
                id="member-instagram"
                type="text"
                value={formData.instagram}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                placeholder="instagram.com/username"
              />
            </div>
            <div>
              <Label htmlFor="member-image">Profile Image (optional)</Label>
              <Input
                id="member-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditMemberDialog({
  member,
  table,
  title,
  onSuccess,
}: {
  member: Member;
  table: string;
  title: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(member);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldImage = formData.image;
    
    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "members");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      // Delete old image from storage
      if (oldImage) {
        await deleteImageFromSupabase(oldImage);
        console.log("Deleted old member image from storage");
      }
      
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const dataToUpdate = {
        ...formData,
        linkedin: formData.linkedin
          ? normalizeUrl(formData.linkedin)
          : formData.linkedin,
        github: formData.github
          ? normalizeUrl(formData.github)
          : formData.github,
        instagram: formData.instagram
          ? normalizeUrl(formData.instagram)
          : formData.instagram,
      };
      const { error } = await supabase
        .from(table)
        .update(dataToUpdate)
        .eq("id", member.id);
      if (error) throw error;
      toast.success("Member updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update member: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
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
              <Input
                id="edit-member-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-member-position">Position</Label>
              <Input
                id="edit-member-position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-member-email">Email (optional)</Label>
              <Input
                id="edit-member-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-member-linkedin">
                LinkedIn URL (optional)
              </Label>
              <Input
                id="edit-member-linkedin"
                type="text"
                value={formData.linkedin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="edit-member-github">GitHub URL (optional)</Label>
              <Input
                id="edit-member-github"
                type="text"
                value={formData.github || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="github.com/username"
              />
            </div>
            <div>
              <Label htmlFor="edit-member-instagram">
                Instagram URL (optional)
              </Label>
              <Input
                id="edit-member-instagram"
                type="text"
                value={formData.instagram || ""}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                placeholder="instagram.com/username"
              />
            </div>
            <div>
              <Label htmlFor="edit-member-image">Profile Image</Label>
              <Input
                id="edit-member-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                Update Member
              </Button>
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
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    poster: "",
    instagram_link: "",
    highlights: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(
      file,
      "event-highlights"
    );
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, poster: url });
      toast.success("Poster uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const highlightsArray = formData.highlights
        .split("\n")
        .filter((h) => h.trim());
      const { error } = await supabase.from("event_highlights").insert([
        {
          ...formData,
          highlights: highlightsArray,
        },
      ]);
      if (error) throw error;
      toast.success("Event highlight added successfully");
      setOpen(false);
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        poster: "",
        instagram_link: "",
        highlights: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add event highlight: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Event Highlight
        </Button>
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
              <Input
                id="highlight-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="highlight-date">Date *</Label>
              <Input
                id="highlight-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="highlight-poster">Event Poster *</Label>
              <Input
                id="highlight-poster"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.poster && (
                <img
                  src={formData.poster}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div>
              <Label htmlFor="highlight-instagram">
                Instagram Link (optional)
              </Label>
              <Input
                id="highlight-instagram"
                type="url"
                value={formData.instagram_link}
                onChange={(e) =>
                  setFormData({ ...formData, instagram_link: e.target.value })
                }
                placeholder="https://instagram.com/..."
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading || !formData.poster}>
                Add Event Highlight
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditEventHighlightDialog({
  highlight,
  onSuccess,
}: {
  highlight: EventHighlight;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    ...highlight,
    highlights: highlight.highlights.join("\n"),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldPoster = formData.poster;
    
    setUploading(true);
    const { url, error } = await uploadImageToSupabase(
      file,
      "event-highlights"
    );
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      // Delete old poster from storage
      if (oldPoster) {
        await deleteImageFromSupabase(oldPoster);
        console.log("Deleted old event poster from storage");
      }
      
      setFormData({ ...formData, poster: url });
      toast.success("Poster uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const highlightsArray = formData.highlights
        .split("\n")
        .filter((h: string) => h.trim());
      const { error } = await supabase
        .from("event_highlights")
        .update({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          poster: formData.poster,
          instagram_link: formData.instagram_link,
          highlights: highlightsArray,
        })
        .eq("id", highlight.id);
      if (error) throw error;
      toast.success("Event highlight updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update event highlight: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Event Highlight</DialogTitle>
          <DialogDescription>
            Update event highlight information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-highlight-title">Title *</Label>
              <Input
                id="edit-highlight-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-highlight-date">Date</Label>
              <Input
                id="edit-highlight-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Leave blank to keep current
              </p>
            </div>
            <div>
              <Label htmlFor="edit-highlight-poster">Event Poster *</Label>
              <Input
                id="edit-highlight-poster"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.poster && (
                <img
                  src={formData.poster}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div>
              <Label htmlFor="edit-highlight-instagram">
                Instagram Link (optional)
              </Label>
              <Input
                id="edit-highlight-instagram"
                type="url"
                value={formData.instagram_link}
                onChange={(e) =>
                  setFormData({ ...formData, instagram_link: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                Update Event Highlight
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddProjectDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    technologies: "",
    github_link: "",
    demo_link: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "projects");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image_url: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const technologiesArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const { error } = await supabase.from("projects").insert([
        {
          ...formData,
          technologies: technologiesArray,
        },
      ]);
      if (error) throw error;
      toast.success("Project added successfully");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        technologies: "",
        github_link: "",
        demo_link: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add project: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Add a new project to the projects page
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="project-title">Title *</Label>
              <Input
                id="project-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="project-description">Description *</Label>
              <Textarea
                id="project-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="project-image">Project Image *</Label>
              <Input
                id="project-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                required={!formData.image_url}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div>
              <Label htmlFor="project-technologies">
                Technologies (comma-separated) *
              </Label>
              <Input
                id="project-technologies"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                placeholder="React, TypeScript, Node.js"
                required
              />
            </div>
            <div>
              <Label htmlFor="project-github">GitHub Link (optional)</Label>
              <Input
                id="project-github"
                type="url"
                value={formData.github_link}
                onChange={(e) =>
                  setFormData({ ...formData, github_link: e.target.value })
                }
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label htmlFor="project-demo">Demo Link (optional)</Label>
              <Input
                id="project-demo"
                type="url"
                value={formData.demo_link}
                onChange={(e) =>
                  setFormData({ ...formData, demo_link: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                Add Project
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditProjectDialog({
  project,
  onSuccess,
}: {
  project: Project;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    technologies: project.technologies.join(", "),
    github_link: project.github_link || "",
    demo_link: project.demo_link || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldImage = formData.image_url;
    
    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "projects");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      // Delete old image from storage
      if (oldImage) {
        await deleteImageFromSupabase(oldImage);
        console.log("Deleted old project image from storage");
      }
      
      setFormData({ ...formData, image_url: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const technologiesArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const { error } = await supabase
        .from("projects")
        .update({
          ...formData,
          technologies: technologiesArray,
        })
        .eq("id", project.id);
      if (error) throw error;
      toast.success("Project updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update project: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-project-title">Title *</Label>
              <Input
                id="edit-project-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-project-description">Description *</Label>
              <Textarea
                id="edit-project-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-project-image">Project Image</Label>
              <Input
                id="edit-project-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading...
                </p>
              )}
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div>
              <Label htmlFor="edit-project-technologies">
                Technologies (comma-separated) *
              </Label>
              <Input
                id="edit-project-technologies"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                placeholder="React, TypeScript, Node.js"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-project-github">
                GitHub Link (optional)
              </Label>
              <Input
                id="edit-project-github"
                type="url"
                value={formData.github_link}
                onChange={(e) =>
                  setFormData({ ...formData, github_link: e.target.value })
                }
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label htmlFor="edit-project-demo">Demo Link (optional)</Label>
              <Input
                id="edit-project-demo"
                type="url"
                value={formData.demo_link}
                onChange={(e) =>
                  setFormData({ ...formData, demo_link: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                Update Project
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddChapterAwardDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    award_title: "",
    year: "",
    description: "",
    certificate_image: "",
    certificate_images: [] as string[],
  });

  const handleMultipleImagesUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const { urls, error } = await uploadMultipleImages(files, "achievements");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (urls && urls.length > 0) {
      setFormData({ 
        ...formData, 
        certificate_image: urls[0],
        certificate_images: urls 
      });
      toast.success(`${urls.length} certificate image(s) uploaded successfully`);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToDelete = formData.certificate_images[index];
    await deleteImageFromSupabase(imageToDelete);
    const newImages = formData.certificate_images.filter((_, i) => i !== index);
    setFormData({ 
      ...formData, 
      certificate_images: newImages,
      certificate_image: newImages[0] || ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from("chapter_awards").insert([formData]);
      if (error) throw error;
      toast.success("Award added successfully");
      setOpen(false);
      setFormData({ award_title: "", year: "", description: "", certificate_image: "", certificate_images: [] });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add award: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Chapter Award</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Chapter Award</DialogTitle>
          <DialogDescription>Add a new best chapter award</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="award-title">Award Title *</Label>
              <Input
                id="award-title"
                value={formData.award_title}
                onChange={(e) => setFormData({ ...formData, award_title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="award-year">Year *</Label>
              <Input
                id="award-year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="award-desc">Description *</Label>
              <Textarea
                id="award-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div>
              <Label>Certificate Images *</Label>
              <MultipleFileUpload
                images={formData.certificate_images}
                onImagesUpload={handleMultipleImagesUpload}
                onRemoveImage={handleRemoveImage}
                uploading={uploading}
                maxImages={10}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload one or more certificate images. First image will be the primary image.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading || formData.certificate_images.length === 0}>Add Award</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditChapterAwardDialog({ award, onSuccess }: { award: ChapterAward; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    award_title: award.award_title,
    year: award.year,
    description: award.description,
    certificate_image: award.certificate_image,
    certificate_images: award.certificate_images || [award.certificate_image],
  });

  const handleMultipleImagesUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const { urls, error } = await uploadMultipleImages(files, "achievements");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (urls && urls.length > 0) {
      const newImages = [...formData.certificate_images, ...urls];
      setFormData({ 
        ...formData, 
        certificate_image: newImages[0],
        certificate_images: newImages 
      });
      toast.success(`${urls.length} certificate image(s) uploaded successfully`);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToDelete = formData.certificate_images[index];
    await deleteImageFromSupabase(imageToDelete);
    const newImages = formData.certificate_images.filter((_, i) => i !== index);
    setFormData({ 
      ...formData, 
      certificate_images: newImages,
      certificate_image: newImages[0] || ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from("chapter_awards").update(formData).eq("id", award.id);
      if (error) throw error;
      toast.success("Award updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update award: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Chapter Award</DialogTitle>
          <DialogDescription>Update award information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-award-title">Award Title *</Label>
              <Input
                id="edit-award-title"
                value={formData.award_title}
                onChange={(e) => setFormData({ ...formData, award_title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-award-year">Year *</Label>
              <Input
                id="edit-award-year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-award-desc">Description *</Label>
              <Textarea
                id="edit-award-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div>
              <Label>Certificate Images *</Label>
              <MultipleFileUpload
                images={formData.certificate_images}
                onImagesUpload={handleMultipleImagesUpload}
                onRemoveImage={handleRemoveImage}
                uploading={uploading}
                maxImages={10}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload one or more certificate images. First image will be the primary image.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading || formData.certificate_images.length === 0}>Update Award</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddPastConvenorDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    tenure_start: "",
    tenure_end: "",
    tenure_month: null as number | null,
    description: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "convenors");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from("past_convenors").insert([formData]);
      if (error) throw error;
      toast.success("Convenor added successfully");
      setOpen(false);
      setFormData({ name: "", image: "", tenure_start: "", tenure_end: "", tenure_month: null, description: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add convenor: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Past Convenor</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Past Convenor</DialogTitle>
          <DialogDescription>Add a past convenor profile</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="convenor-name">Name *</Label>
              <Input
                id="convenor-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="tenure-month">Tenure Month (Optional)</Label>
              <Select
                value={formData.tenure_month?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, tenure_month: value ? parseInt(value) : null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No month</SelectItem>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Month applies to both start and end years
              </p>
            </div>
            <div>
              <Label htmlFor="tenure-start">Tenure Start Year *</Label>
              <Input
                id="tenure-start"
                value={formData.tenure_start}
                onChange={(e) => setFormData({ ...formData, tenure_start: e.target.value })}
                placeholder="2020"
                required
              />
            </div>
            <div>
              <Label htmlFor="tenure-end">Tenure End Year *</Label>
              <Input
                id="tenure-end"
                value={formData.tenure_end}
                onChange={(e) => setFormData({ ...formData, tenure_end: e.target.value })}
                placeholder="2022"
                required
              />
            </div>
            <div>
              <Label htmlFor="convenor-desc">Description</Label>
              <Textarea
                id="convenor-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Photo *</Label>
              <Input type="file" onChange={handleImageUpload} accept="image/*" />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 max-h-40 rounded" />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>Add Convenor</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditPastConvenorDialog({ convenor, onSuccess }: { convenor: PastConvenor; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: convenor.name,
    image: convenor.image,
    tenure_start: convenor.tenure_start,
    tenure_end: convenor.tenure_end,
    tenure_month: convenor.tenure_month || null,
    description: convenor.description || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldImage = formData.image;
    setUploading(true);
    const { url, error } = await uploadImageToSupabase(file, "convenors");
    setUploading(false);

    if (error) {
      toast.error(error);
    } else if (url) {
      if (oldImage) await deleteImageFromSupabase(oldImage);
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { error } = await supabase.from("past_convenors").update(formData).eq("id", convenor.id);
      if (error) throw error;
      toast.success("Convenor updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update convenor: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Past Convenor</DialogTitle>
          <DialogDescription>Update convenor information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-convenor-name">Name *</Label>
              <Input
                id="edit-convenor-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-tenure-month">Tenure Month (Optional)</Label>
              <Select
                value={formData.tenure_month?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, tenure_month: value ? parseInt(value) : null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No month</SelectItem>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Month applies to both start and end years
              </p>
            </div>
            <div>
              <Label htmlFor="edit-tenure-start">Tenure Start Year *</Label>
              <Input
                id="edit-tenure-start"
                value={formData.tenure_start}
                onChange={(e) => setFormData({ ...formData, tenure_start: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-tenure-end">Tenure End Year *</Label>
              <Input
                id="edit-tenure-end"
                value={formData.tenure_end}
                onChange={(e) => setFormData({ ...formData, tenure_end: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-convenor-desc">Description</Label>
              <Textarea
                id="edit-convenor-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Photo</Label>
              <Input type="file" onChange={handleImageUpload} accept="image/*" />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 max-h-40 rounded" />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>Update Convenor</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AddStudentAchievementDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    event_name: "",
    position: "",
    date: "",
    organized_by: "",
    description: "",
    achievement_images: [] as string[],
    linkedin: "",
    github: "",
    instagram: "",
  });

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    const { urls, errors } = await uploadMultipleImages(fileArray, "achievements");
    setUploading(false);

    if (errors && errors.length > 0) {
      toast.error(errors[0]);
    }
    
    if (urls && urls.length > 0) {
      setFormData({ ...formData, achievement_images: [...formData.achievement_images, ...urls] });
      toast.success(`${urls.length} image(s) uploaded successfully`);
    }
  };

  const handleRemoveImage = async (url: string) => {
    await deleteImageFromSupabase(url);
    setFormData({ ...formData, achievement_images: formData.achievement_images.filter(img => img !== url) });
    toast.success("Image removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (formData.achievement_images.length === 0) {
      toast.error("Please upload at least one achievement image");
      return;
    }

    try {
      const submitData = {
        student_name: formData.student_name,
        event_name: formData.event_name,
        position: formData.position,
        date: formData.date,
        organized_by: formData.organized_by,
        description: formData.description,
        achievement_images: formData.achievement_images,
        linkedin: formData.linkedin || null,
        github: formData.github || null,
        instagram: formData.instagram || null,
      };

      const { error } = await supabase.from("student_achievements").insert([submitData]);
      if (error) throw error;
      toast.success("Achievement added successfully");
      setOpen(false);
      setFormData({
        student_name: "",
        event_name: "",
        position: "",
        date: "",
        organized_by: "",
        description: "",
        achievement_images: [],
        linkedin: "",
        github: "",
        instagram: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to add achievement: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Student Achievement</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Student Achievement</DialogTitle>
          <DialogDescription>Record a student achievement</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="student-name">Student Name *</Label>
              <Input
                id="student-name"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="event-name">Event Name *</Label>
              <Input
                id="event-name"
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="1st Place, Winner, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="achievement-date">Date *</Label>
              <Input
                id="achievement-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="organized-by">Organized By *</Label>
              <Input
                id="organized-by"
                value={formData.organized_by}
                onChange={(e) => setFormData({ ...formData, organized_by: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="achievement-desc">Description *</Label>
              <Textarea
                id="achievement-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div>
              <Label>Achievement Images * (Multiple allowed)</Label>
              <Input
                type="file"
                onChange={handleMultipleImagesUpload}
                accept="image/*"
                multiple
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select multiple images to upload
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.achievement_images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <Label className="text-base">Social Links (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-3">Add student's social media profiles</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>Add Achievement</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function EditStudentAchievementDialog({ achievement, onSuccess }: { achievement: StudentAchievement; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    student_name: achievement.student_name,
    event_name: achievement.event_name,
    position: achievement.position,
    date: achievement.date,
    organized_by: achievement.organized_by,
    description: achievement.description,
    achievement_images: achievement.achievement_images || (achievement.achievement_image ? [achievement.achievement_image] : []),
    linkedin: achievement.linkedin || "",
    github: achievement.github || "",
    instagram: achievement.instagram || "",
  });

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    const { urls, errors } = await uploadMultipleImages(fileArray, "achievements");
    setUploading(false);

    if (errors && errors.length > 0) {
      toast.error(errors[0]);
    }
    
    if (urls && urls.length > 0) {
      setFormData({ ...formData, achievement_images: [...formData.achievement_images, ...urls] });
      toast.success(`${urls.length} image(s) uploaded successfully`);
    }
  };

  const handleRemoveImage = async (url: string) => {
    await deleteImageFromSupabase(url);
    setFormData({ ...formData, achievement_images: formData.achievement_images.filter(img => img !== url) });
    toast.success("Image removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (formData.achievement_images.length === 0) {
      toast.error("Please upload at least one achievement image");
      return;
    }

    try {
      const updateData = {
        student_name: formData.student_name,
        event_name: formData.event_name,
        position: formData.position,
        date: formData.date,
        organized_by: formData.organized_by,
        description: formData.description,
        achievement_images: formData.achievement_images,
        linkedin: formData.linkedin || null,
        github: formData.github || null,
        instagram: formData.instagram || null,
      };

      const { error } = await supabase.from("student_achievements").update(updateData).eq("id", achievement.id);
      if (error) throw error;
      toast.success("Achievement updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(`Failed to update achievement: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Student Achievement</DialogTitle>
          <DialogDescription>Update achievement information</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-student-name">Student Name *</Label>
              <Input
                id="edit-student-name"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-event-name">Event Name *</Label>
              <Input
                id="edit-event-name"
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-position">Position *</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-achievement-date">Date *</Label>
              <Input
                id="edit-achievement-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-organized-by">Organized By *</Label>
              <Input
                id="edit-organized-by"
                value={formData.organized_by}
                onChange={(e) => setFormData({ ...formData, organized_by: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-achievement-desc">Description *</Label>
              <Textarea
                id="edit-achievement-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div>
              <Label>Achievement Images * (Multiple allowed)</Label>
              <Input
                type="file"
                onChange={handleMultipleImagesUpload}
                accept="image/*"
                multiple
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select multiple images to upload
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.achievement_images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <Label className="text-base">Social Links (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-3">Add student's social media profiles</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-linkedin">LinkedIn URL</Label>
                  <Input
                    id="edit-linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-github">GitHub URL</Label>
                  <Input
                    id="edit-github"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-instagram">Instagram URL</Label>
                  <Input
                    id="edit-instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>Update Achievement</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default Admin;
