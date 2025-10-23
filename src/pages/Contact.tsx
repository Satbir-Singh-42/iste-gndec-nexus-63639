import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'iste@gndec.ac.in',
      link: 'mailto:iste@gndec.ac.in',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 123 456 7890',
      link: 'tel:+911234567890',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Guru Nanak Dev Engineering College, Ludhiana',
      link: '#',
    },
  ];

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
          </div>

          {/* Contact Form */}
          <div className="tech-card p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  NAME
                </label>
                <Input 
                  placeholder="Your name"
                  className="bg-background border-border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  EMAIL
                </label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background border-border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono text-foreground/80 mb-2">
                  MESSAGE
                </label>
                <Textarea 
                  placeholder="Your message..."
                  rows={5}
                  className="bg-background border-border resize-none"
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
