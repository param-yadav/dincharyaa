
import { useState, useEffect } from "react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialProps;
  delay: number;
}

const TestimonialCard = ({ testimonial, delay }: TestimonialCardProps) => {
  const { name, role, content, avatar } = testimonial;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`bg-white dark:bg-dincharya-text/80 shadow-md rounded-lg p-6 border-t-4 border-dincharya-primary transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="mb-4">
        <svg className="h-8 w-8 text-dincharya-primary opacity-30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-dincharya-text dark:text-white/90 mb-6">
        {content}
      </p>
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={name}
          className="h-10 w-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h4 className="font-medium text-dincharya-text dark:text-white">
            {name}
          </h4>
          <p className="text-sm text-dincharya-text/70 dark:text-white/70">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
