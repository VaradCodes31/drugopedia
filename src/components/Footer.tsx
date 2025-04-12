
import { Pill } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-drugopedia-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Pill className="h-6 w-6" />
              <span className="font-bold text-xl">Drugopedia</span>
            </div>
            <p className="text-drugopedia-100 max-w-xs">
              Your comprehensive resource for accurate and up-to-date drug information.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-drugopedia-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/drugs" className="text-drugopedia-100 hover:text-white transition-colors">
                  Drugs
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-drugopedia-100 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-drugopedia-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-drugopedia-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-drugopedia-100 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <p className="text-drugopedia-100 text-sm">
              The information provided on this site is for informational purposes only and is not intended as a substitute for advice from your physician or other healthcare professional.
            </p>
          </div>
        </div>
        
        <div className="border-t border-drugopedia-700 mt-8 pt-6 text-center text-drugopedia-200 text-sm">
          <p>© {currentYear} Drugopedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
