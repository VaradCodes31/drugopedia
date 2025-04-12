
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeInSection from '@/components/FadeInSection';
import DrugCard from '@/components/DrugCard';
import { getCategoryById, getDrugsByCategory } from '@/services/drugService';

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: category, isLoading: categoryLoading, isError: categoryError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: !!id
  });
  
  const { data: drugs, isLoading: drugsLoading, isError: drugsError } = useQuery({
    queryKey: ['categoryDrugs', id],
    queryFn: () => getDrugsByCategory(Number(id)),
    enabled: !!id
  });
  
  const isLoading = categoryLoading || drugsLoading;
  const isError = categoryError || drugsError;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-4xl mx-auto mt-16">
            <div className="animate-pulse">
              <div className="h-8 bg-drugopedia-200 rounded w-2/3 mb-4"></div>
              <div className="h-5 bg-drugopedia-200 rounded w-full mb-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="drug-card">
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
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isError || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the category you were looking for. It may have been removed or doesn't exist.
            </p>
            <Link to="/categories">
              <Button className="bg-drugopedia-600 hover:bg-drugopedia-700">
                Return to Categories
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 flex-grow">
        <div className="max-w-4xl mx-auto mt-8">
          <FadeInSection>
            <div className="mb-10">
              <Link 
                to="/categories" 
                className="inline-flex items-center text-drugopedia-600 hover:text-drugopedia-800 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all categories
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {category.description || `Browse all medications in the ${category.name} category.`}
              </p>
              
              <div className="flex items-center text-gray-500">
                <span className="font-medium">{category.drug_count} medications in this category</span>
              </div>
            </div>
          </FadeInSection>
          
          {drugsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          ) : drugs && drugs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drugs.map((drug, index) => (
                <FadeInSection key={drug.id} delay={index * 50}>
                  <DrugCard
                    id={drug.id}
                    name={drug.name}
                    category={category.name}
                    description={drug.description}
                    requiresPrescription={drug.requires_prescription}
                  />
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No drugs found in this category</h3>
              <p className="text-gray-500 mb-6">
                We don't have any medications listed in the {category.name} category yet.
              </p>
              <Link to="/drugs">
                <Button className="bg-drugopedia-600 hover:bg-drugopedia-700">
                  Browse All Drugs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryDetail;
