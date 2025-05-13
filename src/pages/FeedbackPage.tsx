
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const FeedbackPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it shortly.",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setFeedbackType("general");
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-dincharya-text">Feedback</h1>
      <p className="text-dincharya-text/80 mb-6">
        We value your feedback! Please let us know how we can improve your experience with Dincharya.
      </p>
      
      <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-dincharya-text dark:text-white mb-2">
              Feedback Type
            </label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="dincharya-input w-full"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="compliment">Compliment</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-dincharya-text dark:text-white mb-2">
              Your Feedback
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="dincharya-input w-full min-h-[150px]"
              placeholder="Please provide as much detail as possible..."
              required
            />
          </div>
          
          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" className="btn-primary px-8">
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
