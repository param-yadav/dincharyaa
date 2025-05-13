
import { useState, useEffect } from "react";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface FeatureCardProps {
  feature: FeatureProps;
  delay: number;
}

const FeatureCard = ({ feature, delay }: FeatureCardProps) => {
  const { title, description, icon: Icon, color } = feature;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`feature-card transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-dincharya-text dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-dincharya-text/70 dark:text-white/70">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
