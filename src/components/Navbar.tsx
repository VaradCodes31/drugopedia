
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pill, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/drugs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Pill className="h-6 w-6 text-drugopedia-600" />
          <span className="font-bold text-xl text-drugopedia-800">Drugopedia</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-drugopedia-600 transition-colors">
            Home
          </Link>
          <Link to="/drugs" className="text-foreground hover:text-drugopedia-600 transition-colors">
            Drugs
          </Link>
          <Link to="/categories" className="text-foreground hover:text-drugopedia-600 transition-colors">
            Categories
          </Link>
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search drugs..."
              className="w-64 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-drugopedia-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/drugs" 
              className="text-foreground hover:text-drugopedia-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Drugs
            </Link>
            <Link 
              to="/categories" 
              className="text-foreground hover:text-drugopedia-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search drugs..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
