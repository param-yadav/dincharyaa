
import { useEffect, useState } from "react";

const HeroImage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="relative w-full max-w-lg">
      <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <img
          src="/lovable-uploads/a30d8d0d-4777-476a-bf00-8cb32ae8e984.png"
          alt="Dincharya Hero"
          className="w-full h-auto rounded-lg shadow-2xl"
        />
      </div>
      
      {/* Floating elements for decoration */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-dincharya-secondary/30 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-dincharya-primary/20 rounded-full blur-xl" />
      
      {/* Ornamental element */}
      <div className="absolute -bottom-4 -right-10 transform rotate-12">
        <img
          src="/lovable-uploads/7b9e64ad-467b-4f8e-b543-70e78e2ceb8a.png"
          alt="Dincharya Logo"
          className="w-20 h-20 animate-float"
        />
      </div>
    </div>
  );
};

export default HeroImage;
