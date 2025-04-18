
import { Pill, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface DrugCardProps {
  id: number;
  name: string;
  category: string;
  description: string;
  requiresPrescription: boolean;
}

const DrugCard = ({ id, name, category, description, requiresPrescription }: DrugCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={`/drug/${id}`}
      className="drug-card block glow-effect"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className="flex items-center group">
            <div className={`mr-3 rounded-full p-3 transition-colors duration-300 ${
              isHovered ? 'bg-drugopedia-100' : 'bg-drugopedia-50'
            }`}>
              <Pill className={`h-6 w-6 ${
                isHovered ? 'text-drugopedia-600 animate-float' : 'text-drugopedia-400'
              } transition-colors duration-300`} />
            </div>
            <h3 className="font-bold text-xl text-foreground group-hover:text-drugopedia-600 transition-colors duration-300">
              {name}
            </h3>
          </div>
          
          {requiresPrescription && (
            <div 
              className="flex items-center text-amber-500 animate-float" 
              style={{ animationDelay: '0.2s' }}
              title="Prescription required"
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <span className="inline-block bg-gradient-to-r from-drugopedia-100 to-drugopedia-200 text-drugopedia-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        
        <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
          {description}
        </p>
        
        <div className={`text-drugopedia-600 font-medium flex items-center transition-all duration-300 ${
          isHovered ? 'translate-x-2' : ''
        }`}>
          <span>View details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform duration-300 ${
            isHovered ? 'translate-x-1' : ''
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-drugopedia-50/10 via-drugopedia-100/10 to-drugopedia-50/10 animate-glow"></div>
        )}
      </div>
    </Link>
  );
};

export default DrugCard;
