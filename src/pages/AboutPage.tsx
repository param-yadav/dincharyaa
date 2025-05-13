
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-dincharya-text">About Dincharya</h1>
        <p className="text-lg text-dincharya-text/80 max-w-3xl">
          Dincharya is a task management application inspired by traditional Indian daily routines, helping users organize their time effectively and boost productivity.
        </p>
      </div>
      
      {/* Our Story */}
      <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-dincharya-primary">Our Story</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
              Dincharya was born from the ancient concept of "Dinacharya" from Ayurveda, which emphasizes the importance of daily routines for optimal health and wellbeing. Our founder, inspired by these principles, created a modern tool that helps people establish healthy routines while managing their daily tasks.
            </p>
            <p className="text-dincharya-text/90 dark:text-white/90">
              We believe that a well-structured day leads to better productivity, reduced stress, and improved overall wellbeing. Our application combines traditional wisdom with modern technology to help users create balanced routines that work for their unique lifestyles.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/lovable-uploads/a30d8d0d-4777-476a-bf00-8cb32ae8e984.png"
              alt="Dincharya Story" 
              className="rounded-lg max-h-64 object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="bg-dincharya-primary text-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          To empower individuals to create mindful daily routines that enhance productivity while promoting balance and wellbeing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
            <p className="text-white/80">
              We create intuitive tools that simplify task management rather than complicate it.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Balance</h3>
            <p className="text-white/80">
              We promote balanced routines that include work, rest, and personal growth.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Mindfulness</h3>
            <p className="text-white/80">
              We encourage conscious planning and reflection in daily activities.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dincharya-primary">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
              alt="Team Member"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-dincharya-text dark:text-white">Anjali Patel</h3>
            <p className="text-dincharya-text/70 dark:text-white/70">Founder & CEO</p>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
              alt="Team Member"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-dincharya-text dark:text-white">Raj Kumar</h3>
            <p className="text-dincharya-text/70 dark:text-white/70">CTO</p>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
              alt="Team Member"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-dincharya-text dark:text-white">Priya Sharma</h3>
            <p className="text-dincharya-text/70 dark:text-white/70">Head of Design</p>
          </div>
        </div>
      </div>
      
      {/* Join Us CTA */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4 text-dincharya-text">Join the Dincharya Community</h2>
        <p className="text-dincharya-text/80 mb-6 max-w-2xl mx-auto">
          Start your journey toward better productivity and balanced daily routines with Dincharya.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="btn-primary">
            Sign Up Now
          </Button>
          <Link to="/contact">
            <Button variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
