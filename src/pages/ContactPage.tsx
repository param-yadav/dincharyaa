
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram,
  Linkedin
} from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible!",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-dincharya-text">Contact Us</h1>
      <p className="text-dincharya-text/80 mb-8">
        Have questions or feedback? We'd love to hear from you.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dincharya-text dark:text-white mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="dincharya-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dincharya-text dark:text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dincharya-input w-full"
                    required
                  />
                </div>
              </div>
              
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-dincharya-text dark:text-white mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="dincharya-input w-full"
                  required
                />
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-dincharya-text dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="dincharya-input w-full min-h-[150px]"
                  required
                />
              </div>
              
              {/* Submit Button */}
              <div>
                <Button type="submit" className="btn-primary w-full">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div>
          <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-dincharya-primary mt-1 mr-3" />
                <p className="text-dincharya-text/90 dark:text-white/90">
                  123 Productivity Street<br />
                  Task City, TD 12345<br />
                  India
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-dincharya-primary mr-3" />
                <p className="text-dincharya-text/90 dark:text-white/90">
                  +91 123 456 7890
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-dincharya-primary mr-3" />
                <p className="text-dincharya-text/90 dark:text-white/90">
                  contact@dincharya.com
                </p>
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">Connect With Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-dincharya-primary text-white flex items-center justify-center hover:bg-dincharya-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-dincharya-primary text-white flex items-center justify-center hover:bg-dincharya-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-dincharya-primary text-white flex items-center justify-center hover:bg-dincharya-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-dincharya-primary text-white flex items-center justify-center hover:bg-dincharya-accent transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="mt-10 bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">Find Us</h2>
        <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-dincharya-text/60 dark:text-white/60">
            Map will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
