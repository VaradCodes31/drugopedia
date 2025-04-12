
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Search, BookOpen, AlertTriangle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeInSection from '@/components/FadeInSection';
import { useQuery } from '@tanstack/react-query';
import { getDrugCategories, getTopDrugs } from '@/services/drugService';
import DrugCard from '@/components/DrugCard';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: topDrugs, isLoading: drugsLoading } = useQuery({
    queryKey: ['topDrugs'],
    queryFn: getTopDrugs
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['drugCategories'],
    queryFn: getDrugCategories
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/drugs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-drugopedia-50 to-sky-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInSection>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-drugopedia-900 mb-6">
                Your Comprehensive Drug Information Resource
              </h1>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <p className="text-xl text-drugopedia-700 mb-8">
                Access detailed information about medications, their effects, dosages, and side effects in one place.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={400}>
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Input
                  type="search"
                  placeholder="Search drugs by name, category or condition..."
                  className="w-full h-14 pl-5 pr-12 rounded-full shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1 h-12 rounded-full px-6 bg-drugopedia-600 hover:bg-drugopedia-700"
                >
                  <Search className="h-5 w-5 mr-2" />
                  <span>Search</span>
                </Button>
              </form>
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-center mb-12">Why use Drugopedia?</h2>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection delay={100}>
              <div className="bg-drugopedia-50 p-8 rounded-xl shadow-sm">
                <div className="bg-drugopedia-100 p-3 rounded-full inline-block mb-4">
                  <BookOpen className="h-6 w-6 text-drugopedia-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Database</h3>
                <p className="text-gray-600">
                  Access an extensive database of medications with detailed information on dosage, side effects, and interactions.
                </p>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <div className="bg-drugopedia-50 p-8 rounded-xl shadow-sm">
                <div className="bg-drugopedia-100 p-3 rounded-full inline-block mb-4">
                  <AlertTriangle className="h-6 w-6 text-drugopedia-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Safety Information</h3>
                <p className="text-gray-600">
                  Get important safety information, warnings, and precautions for all medications in our database.
                </p>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={300}>
              <div className="bg-drugopedia-50 p-8 rounded-xl shadow-sm">
                <div className="bg-drugopedia-100 p-3 rounded-full inline-block mb-4">
                  <UserCheck className="h-6 w-6 text-drugopedia-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User-Friendly Interface</h3>
                <p className="text-gray-600">
                  Our intuitive interface makes it easy to find the information you need quickly and efficiently.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* Popular Drugs Section */}
      <section className="py-20 bg-drugopedia-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <FadeInSection>
              <h2 className="text-3xl font-bold">Popular Medications</h2>
            </FadeInSection>
            
            <FadeInSection>
              <Link to="/drugs" className="text-drugopedia-600 hover:text-drugopedia-800 font-medium flex items-center">
                <span>View all drugs</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </FadeInSection>
          </div>
          
          {drugsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="drug-card animate-pulse">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-drugopedia-200 rounded-full mr-3"></div>
                      <div className="h-6 bg-drugopedia-200 rounded w-1/2"></div>
                    </div>
                    <div className="mb-4">
                      <div className="h-4 w-20 bg-drugopedia-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-drugopedia-200 rounded w-full"></div>
                      <div className="h-4 bg-drugopedia-200 rounded w-5/6"></div>
                      <div className="h-4 bg-drugopedia-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topDrugs?.map((drug, index) => (
                <FadeInSection key={drug.id} delay={index * 100}>
                  <DrugCard
                    id={drug.id}
                    name={drug.name}
                    category={drug.category}
                    description={drug.description}
                    requiresPrescription={drug.requires_prescription}
                  />
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          </FadeInSection>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-drugopedia-50 rounded-lg p-6 animate-pulse">
                  <div className="h-5 bg-drugopedia-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-drugopedia-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories?.map((category, index) => (
                <FadeInSection key={category.id} delay={index * 50}>
                  <Link 
                    to={`/category/${category.id}`} 
                    className="bg-drugopedia-50 hover:bg-drugopedia-100 rounded-lg p-6 transition-colors duration-300"
                  >
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.drug_count} drugs</p>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <FadeInSection>
              <Link to="/categories">
                <Button className="bg-drugopedia-600 hover:bg-drugopedia-700">
                  View All Categories
                </Button>
              </Link>
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-drugopedia-700 to-drugopedia-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to explore our drug database?
            </h2>
          </FadeInSection>
          
          <FadeInSection delay={100}>
            <p className="text-xl text-drugopedia-100 mb-8 max-w-3xl mx-auto">
              Get access to comprehensive information on thousands of medications at your fingertips.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <Link to="/drugs">
              <Button className="bg-white text-drugopedia-800 hover:bg-drugopedia-50 px-8 py-6 text-lg font-medium">
                Explore the Database
              </Button>
            </Link>
          </FadeInSection>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
