
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DrugCard from '@/components/DrugCard';
import FadeInSection from '@/components/FadeInSection';
import { getDrugs, getDrugCategories } from '@/services/drugService';

const Drugs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name_asc');
  
  // Fetch drugs based on filters
  const { data: drugs, isLoading, refetch } = useQuery({
    queryKey: ['drugs', searchQuery, selectedCategories, prescriptionFilter, sortBy],
    queryFn: () => getDrugs({
      search: searchQuery,
      categories: selectedCategories,
      prescriptionFilter,
      sortBy
    })
  });
  
  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['drugCategories'],
    queryFn: getDrugCategories
  });
  
  useEffect(() => {
    // Update search params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (prescriptionFilter !== 'all') params.set('prescription', prescriptionFilter);
    if (sortBy !== 'name_asc') params.set('sort', sortBy);
    
    setSearchParams(params);
    
    // Refetch data with new filters
    refetch();
  }, [searchQuery, selectedCategories, prescriptionFilter, sortBy, setSearchParams, refetch]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPrescriptionFilter('all');
    setSortBy('name_asc');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-drugopedia-50 to-sky-100">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Drugs Database
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={100}>
            <p className="text-xl text-center text-drugopedia-700 mb-8 max-w-3xl mx-auto">
              Browse our comprehensive database of medications, filter by category, and find detailed information.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Input
                type="search"
                placeholder="Search drugs by name or description..."
                className="w-full h-12 pl-5 pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-1 top-1 h-10 px-4 bg-drugopedia-600 hover:bg-drugopedia-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </FadeInSection>
        </div>
      </section>
      
      {/* Drugs Listing */}
      <section className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
            {/* Filters for desktop */}
            <div className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {categories?.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox 
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id.toString())}
                        onCheckedChange={() => toggleCategory(category.id.toString())}
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name} ({category.drug_count})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Prescription</h4>
                <Select value={prescriptionFilter} onValueChange={setPrescriptionFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by prescription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drugs</SelectItem>
                    <SelectItem value="prescription">Prescription Only</SelectItem>
                    <SelectItem value="otc">Over the Counter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Sort By</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort drugs by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
            
            {/* Mobile filters */}
            <div className="md:hidden w-full sticky top-16 z-10 bg-gray-50 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Categories</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {categories?.map(category => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox 
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.id.toString())}
                              onCheckedChange={() => toggleCategory(category.id.toString())}
                            />
                            <label 
                              htmlFor={`mobile-category-${category.id}`}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Prescription</h4>
                        <Select value={prescriptionFilter} onValueChange={setPrescriptionFilter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by prescription" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Drugs</SelectItem>
                            <SelectItem value="prescription">Prescription Only</SelectItem>
                            <SelectItem value="otc">Over the Counter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={clearFilters}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Drug listing */}
            <div className="flex-1">
              {/* Active filters */}
              {(searchQuery || selectedCategories.length > 0 || prescriptionFilter !== 'all') && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Active filters:</span>
                    
                    {searchQuery && (
                      <div className="bg-drugopedia-100 text-drugopedia-800 text-xs rounded-full px-3 py-1 flex items-center">
                        <span>Search: {searchQuery}</span>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="ml-2 text-drugopedia-600 hover:text-drugopedia-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {selectedCategories.map(catId => {
                      const category = categories?.find(c => c.id.toString() === catId);
                      return category ? (
                        <div key={catId} className="bg-drugopedia-100 text-drugopedia-800 text-xs rounded-full px-3 py-1 flex items-center">
                          <span>Category: {category.name}</span>
                          <button 
                            onClick={() => toggleCategory(catId)}
                            className="ml-2 text-drugopedia-600 hover:text-drugopedia-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                    
                    {prescriptionFilter !== 'all' && (
                      <div className="bg-drugopedia-100 text-drugopedia-800 text-xs rounded-full px-3 py-1 flex items-center">
                        <span>
                          {prescriptionFilter === 'prescription' ? 'Prescription Only' : 'Over the Counter'}
                        </span>
                        <button 
                          onClick={() => setPrescriptionFilter('all')}
                          className="ml-2 text-drugopedia-600 hover:text-drugopedia-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
              )}
              
              {isLoading ? (
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
                        category={drug.category}
                        description={drug.description}
                        requiresPrescription={drug.requires_prescription}
                      />
                    </FadeInSection>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No drugs found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Drugs;
