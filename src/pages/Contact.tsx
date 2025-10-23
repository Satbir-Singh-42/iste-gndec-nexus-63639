import { useState } from 'react';
import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'istegndec.original@gmail.com',
      link: 'mailto:istegndec.original@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Guru Nanak Dev Engineering College, Ludhiana',
      link: '#',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Sending your message...');

    try {
      // Use relative URL - Vite proxy will forward to email server
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Message sent successfully!', {
          id: loadingToast,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        toast.error(data.error || 'Failed to send message', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message. Please try again.', {
        id: loadingToast,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full">
      <TechNavbar />
      
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">CONTACT PORTAL</span>
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
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-primary" />
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us for any queries, collaborations, or to know more about ISTE GNDEC.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="tech-card p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 border-2 border-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <a 
                        href={item.link}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.content}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map */}
            <div className="tech-card p-6">
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
          <div className="tech-card p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  NAME
                </label>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-background border-border"
                  required
                />
              </div>
              
              <div>
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
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  MESSAGE
                </label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={5}
                  className="bg-background border-border resize-none"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono tracking-wider"
              >
                <Send className="w-4 h-4 mr-2" />
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </div>
      </main>

      <TechFooter />
    </div>
  );
};

export default Contact;
