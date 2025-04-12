
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Pill, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeInSection from '@/components/FadeInSection';
import { getDrugCategories } from '@/services/drugService';

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['drugCategories'],
    queryFn: getDrugCategories
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-drugopedia-50 to-sky-100">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Drug Categories
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={100}>
            <p className="text-xl text-center text-drugopedia-700 mb-8 max-w-3xl mx-auto">
              Browse medications by therapeutic category to find information on specific types of drugs.
            </p>
          </FadeInSection>
        </div>
      </section>
      
      {/* Categories Grid */}
      <section className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <div key={item} className="drug-card animate-pulse">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-drugopedia-200 rounded-full mr-3"></div>
                      <div className="h-6 bg-drugopedia-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-drugopedia-200 rounded w-24 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-drugopedia-200 rounded w-full"></div>
                      <div className="h-4 bg-drugopedia-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category, index) => (
                <FadeInSection key={category.id} delay={index * 50}>
                  <Link 
                    to={`/category/${category.id}`}
                    className="drug-card block hover:border-drugopedia-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-drugopedia-100 p-2 rounded-full mr-3">
                          <Pill className="h-6 w-6 text-drugopedia-600" />
                        </div>
                        <h3 className="font-bold text-xl text-foreground">{category.name}</h3>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-drugopedia-600 font-medium">
                          {category.drug_count} medications
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                        {category.description || `Browse all medications in the ${category.name} category.`}
                      </p>
                      
                      <div className="text-drugopedia-600 font-medium flex items-center transition-all duration-300 group-hover:translate-x-2">
                        <span>View medications</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Categories;
