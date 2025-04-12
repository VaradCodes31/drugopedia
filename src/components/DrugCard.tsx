
import { Pill, Bookmark, AlertTriangle } from 'lucide-react';
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
      className="drug-card block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Pill className={`mr-3 h-8 w-8 ${isHovered ? 'text-drugopedia-600' : 'text-drugopedia-400'} transition-colors duration-300`} />
            <h3 className="font-bold text-xl text-foreground">{name}</h3>
          </div>
          
          {requiresPrescription && (
            <div className="flex items-center text-amber-500" title="Prescription required">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <span className="inline-block bg-drugopedia-100 text-drugopedia-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        
        <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
          {description}
        </p>
        
        <div className={`text-drugopedia-600 font-medium flex items-center transition-all duration-300 ${isHovered ? 'translate-x-2' : ''}`}>
          <span>View details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default DrugCard;
