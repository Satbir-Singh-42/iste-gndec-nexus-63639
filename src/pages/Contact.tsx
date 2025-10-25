import { useState, useEffect, useRef } from "react";
import TechFooter from "@/components/TechFooter";
import { Mail, Phone, MapPin, Send, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactFormEnabled, setContactFormEnabled] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contactCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "istegndec.original@gmail.com",
      link: "mailto:istegndec.original@gmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Guru Nanak Dev Engineering College, Ludhiana",
      link: "#",
    },
  ];

  useEffect(() => {
    fetchContactFormSetting();
  }, []);

  const fetchContactFormSetting = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "contact_form_enabled")
        .single();

      if (data) {
        setContactFormEnabled(data.setting_value);
      }
    } catch (error) {
      console.error("Error fetching contact form setting:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if contact form is disabled
    if (!contactFormEnabled) {
      toast.error(
        "Contact form is currently disabled. Please email us directly at istegndec.original@gmail.com"
      );
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if we're in development (localhost)
    const isDevelopment = window.location.hostname === "localhost";

    if (isDevelopment) {
      toast.info(
        "📧 Development Mode: Email functionality works when deployed to Vercel. For now, you can email us directly at istegndec.original@gmail.com",
        {
          duration: 6000,
        }
      );
      // Still reset the form to show it "worked"
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Message sent successfully!", {
          id: loadingToast,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send message", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Failed to send message. Please email us directly at istegndec.original@gmail.com",
        {
          id: loadingToast,
          duration: 6000,
        }
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // Left section animation
      if (leftSectionRef.current) {
        gsap.from(leftSectionRef.current, {
          scrollTrigger: {
            trigger: leftSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          x: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Contact cards stagger animation
      contactCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
          });
        }
      });

      // Form animation
      if (formRef.current) {
        gsap.from(formRef.current, {
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          x: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        // Animate form fields
        const formFields = formRef.current.querySelectorAll(".form-field");
        gsap.from(formFields, {
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full relative z-10">
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div ref={heroRef} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">
              CONTACT PORTAL
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div ref={leftSectionRef} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-primary" />
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us for any queries, collaborations, or to know more
                about ISTE GNDEC.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (contactCardsRef.current[index] = el)}
                  className="tech-card p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 border-2 border-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <a
                        href={item.link}
                        className="text-muted-foreground hover:text-primary transition-colors">
                        {item.content}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map */}
            <div
              ref={(el) => (contactCardsRef.current[contactInfo.length] = el)}
              className="tech-card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Find Us On Map
              </h3>
              <div className="w-full h-[300px] md:h-[400px] overflow-hidden border border-border">
                <iframe
                  title="GNDEC Location Map"
                  src="https://maps.google.com/maps?q=Guru+Nanak+Dev+Engineering+College,+Ludhiana&output=embed&z=15"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="tech-card p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            {!contactFormEnabled && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <p className="text-sm text-yellow-500">
                  The contact form is currently disabled for maintenance. Please
                  email us directly at{" "}
                  <a
                    href="mailto:istegndec.original@gmail.com"
                    className="underline hover:text-yellow-400">
                    istegndec.original@gmail.com
                  </a>
                </p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  NAME
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-background border-border"
                  disabled={!contactFormEnabled}
                  required
                />
              </div>

              <div className="form-field">
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  EMAIL
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-background border-border"
                  disabled={!contactFormEnabled}
                  required
                />
              </div>

              <div className="form-field">
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  MESSAGE
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={8}
                  className="bg-background border-border resize-none"
                  disabled={!contactFormEnabled}
                  required
                />
              </div>

              <div className="form-field">
                <Button
                  type="submit"
                  disabled={!contactFormEnabled}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4 mr-2" />
                  {contactFormEnabled ? "SEND MESSAGE" : "FORM DISABLED"}
                </Button>
              </div>
            </form>

            {/* Attachment links for Documents */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Attachment links
              </h3>
              <div className="space-y-3">
                <a
                  href="/ISTE_Recruitment_Form.pdf"
                  download
                  className="flex items-center justify-between p-4 bg-background border border-border hover:border-primary/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-primary/30 bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">
                        ISTE Recruitment Form
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Application form for student membership
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                <a
                  href="/ISTE_Dossier.pdf"
                  download
                  className="flex items-center justify-between p-4 bg-background border border-border hover:border-primary/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-primary/30 bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">
                        ISTE Activity Dossier
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Activity tracking document for members
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TechFooter />
    </div>
  );
};

export default Contact;
