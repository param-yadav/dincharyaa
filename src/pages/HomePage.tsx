
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Clock, 
  Bell, 
  PieChart, 
  Users, 
  Shield, 
  ArrowRight
} from "lucide-react";
import HeroImage from "../components/home/HeroImage";
import FeatureCard from "../components/home/FeatureCard";
import TestimonialCard from "../components/home/TestimonialCard";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const features = [
    {
      title: "Task Management",
      description: "Create, organize, and prioritize your daily tasks with our intuitive interface",
      icon: CheckSquare,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Time Tracking",
      description: "Monitor how you spend your time and optimize your daily schedule",
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Reminders",
      description: "Never miss an important task with customizable notifications",
      icon: Bell,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Progress Analytics",
      description: "Visualize your productivity with comprehensive charts and reports",
      icon: PieChart,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Team Collaboration",
      description: "Share tasks and projects with your team for seamless coordination",
      icon: Users,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Privacy First",
      description: "Your data is secure with our robust privacy and security measures",
      icon: Shield,
      color: "bg-teal-100 text-teal-600",
    },
  ];
  
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Product Manager",
      content: "Dincharya has transformed how I organize my day. The intuitive interface and beautiful design make task management enjoyable!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Rahul Patel",
      role: "Freelance Designer",
      content: "As a freelancer juggling multiple projects, Dincharya keeps me on track. The reminders and progress tracking are game-changers!",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Meera Kapoor",
      role: "Student",
      content: "Balancing studies and personal life was challenging until I found Dincharya. Now I can manage my assignments and social activities efficiently.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    }
  ];

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dincharya-text leading-tight mb-6">
              Manage your tasks <span className="text-dincharya-primary">efficiently</span>
            </h1>
            <p className="text-xl text-dincharya-text/80 mb-8 max-w-lg">
              Organize your daily tasks, set reminders, and track your progress with ease using Dincharya's beautiful and intuitive interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary text-base px-8 py-6">
                Get Started
              </Button>
              <Button variant="outline" className="text-base px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <HeroImage />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-dincharya-text/90">
        <div className="container mx-auto px-4">
          <h2 className="section-heading text-center">
            Features designed for productivity
          </h2>
          <p className="section-subheading text-center mx-auto">
            Discover how Dincharya can help you manage your time and tasks effectively
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-dincharya-primary/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white dark:bg-dincharya-text/90 rounded-2xl shadow-xl p-8 md:p-12 border border-dincharya-muted/20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold text-dincharya-text dark:text-white mb-4">
                  Ready to transform your productivity?
                </h2>
                <p className="text-dincharya-text/80 dark:text-white/80 mb-0 max-w-lg">
                  Join thousands of users who have improved their daily routine with Dincharya. Start for free today!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-primary text-base px-8 py-6">
                  Sign Up Free
                </Button>
                <Button variant="outline" className="text-base px-8 py-6">
                  See Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-dincharya-text/90">
        <div className="container mx-auto px-4">
          <h2 className="section-heading text-center">
            What our users say
          </h2>
          <p className="section-subheading text-center mx-auto">
            Discover how Dincharya has helped people improve their productivity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-dincharya-primary to-dincharya-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start organizing your day with Dincharya
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and transform your productivity today.
          </p>
          <Button className="bg-white text-dincharya-primary hover:bg-white/90 text-base px-8 py-6">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
