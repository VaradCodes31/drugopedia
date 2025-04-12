import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Activity, 
  Scale, 
  ArrowLeft,
  Bell,
  Star
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeInSection from '@/components/FadeInSection';
import { getDrugById } from '@/services/drugService';

const DrugDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: drug, isLoading, isError } = useQuery({
    queryKey: ['drug', id],
    queryFn: () => getDrugById(Number(id)),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-3xl mx-auto mt-16">
            <div className="animate-pulse">
              <div className="h-8 bg-drugopedia-200 rounded w-2/3 mb-4"></div>
              <div className="h-5 bg-drugopedia-200 rounded-full w-32 mb-8"></div>
              
              <div className="h-6 bg-drugopedia-200 rounded w-full mb-3"></div>
              <div className="h-6 bg-drugopedia-200 rounded w-5/6 mb-3"></div>
              <div className="h-6 bg-drugopedia-200 rounded w-4/6 mb-8"></div>
              
              <div className="h-10 bg-drugopedia-200 rounded w-full mb-6"></div>
              
              <div className="space-y-4">
                <div className="h-6 bg-drugopedia-200 rounded w-full"></div>
                <div className="h-6 bg-drugopedia-200 rounded w-full"></div>
                <div className="h-6 bg-drugopedia-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isError || !drug) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Drug Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the drug information you were looking for. It may have been removed or doesn't exist.
            </p>
            <Link to="/drugs">
              <Button className="bg-drugopedia-600 hover:bg-drugopedia-700">
                Return to Drugs List
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
        <div className="max-w-3xl mx-auto mt-8">
          <FadeInSection>
            <div className="mb-6">
              <Link 
                to="/drugs" 
                className="inline-flex items-center text-drugopedia-600 hover:text-drugopedia-800 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all drugs
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{drug.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-block bg-drugopedia-100 text-drugopedia-800 text-sm font-medium px-3 py-1 rounded-full">
                  {drug.category}
                </span>
                
                {drug.requires_prescription && (
                  <span className="inline-flex items-center bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Prescription Required
                  </span>
                )}
              </div>
            </div>
          </FadeInSection>
          
          {drug.warnings && drug.warnings.length > 0 && (
            <FadeInSection delay={100}>
              <Alert className="mb-6 border-amber-300 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Important Safety Information</AlertTitle>
                <AlertDescription className="text-amber-700">
                  {drug.warnings}
                </AlertDescription>
              </Alert>
            </FadeInSection>
          )}
          
          <FadeInSection delay={200}>
            <div className="bg-white rounded-xl shadow-md border p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">
                {drug.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start">
                  <div className="bg-drugopedia-100 p-2 rounded-full mr-3">
                    <Shield className="h-5 w-5 text-drugopedia-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Drug Class</h3>
                    <p>{drug.drug_class || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-drugopedia-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-drugopedia-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Onset of Action</h3>
                    <p>{drug.onset_of_action || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-drugopedia-100 p-2 rounded-full mr-3">
                    <Activity className="h-5 w-5 text-drugopedia-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Half Life</h3>
                    <p>{drug.half_life || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-drugopedia-100 p-2 rounded-full mr-3">
                    <Scale className="h-5 w-5 text-drugopedia-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Route of Administration</h3>
                    <p>{drug.route_of_administration || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={300}>
            <Tabs defaultValue="dosage" className="bg-white rounded-xl shadow-md border mb-8">
              <TabsList className="w-full border-b rounded-none p-0">
                <TabsTrigger value="dosage" className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-drugopedia-600">
                  Dosage
                </TabsTrigger>
                <TabsTrigger value="side-effects" className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-drugopedia-600">
                  Side Effects
                </TabsTrigger>
                <TabsTrigger value="interactions" className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-drugopedia-600">
                  Interactions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dosage" className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Dosage</h3>
                <div className="prose max-w-none">
                  {drug.dosage ? (
                    <div dangerouslySetInnerHTML={{ __html: drug.dosage }} />
                  ) : (
                    <p>Dosage information not available. Please consult with your healthcare provider.</p>
                  )}
                </div>
                
                {drug.max_dosage && (
                  <Alert className="mt-6 border-drugopedia-300 bg-drugopedia-50">
                    <Bell className="h-4 w-4 text-drugopedia-600" />
                    <AlertTitle>Maximum Recommended Dosage</AlertTitle>
                    <AlertDescription>
                      {drug.max_dosage}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="side-effects" className="p-6">
                <h3 className="text-xl font-semibold mb-4">Potential Side Effects</h3>
                
                {drug.side_effects && drug.side_effects.length > 0 ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="common">
                      <AccordionTrigger>Common Side Effects</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {drug.common_side_effects?.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="serious">
                      <AccordionTrigger>Serious Side Effects</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <Alert className="border-red-300 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-800">Seek Medical Attention</AlertTitle>
                            <AlertDescription className="text-red-700">
                              If you experience any of these serious side effects, contact your healthcare provider immediately.
                            </AlertDescription>
                          </Alert>
                          
                          <ul className="list-disc pl-5 space-y-1 text-red-700">
                            {drug.serious_side_effects?.map((effect, index) => (
                              <li key={index}>{effect}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="rare">
                      <AccordionTrigger>Rare Side Effects</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {drug.rare_side_effects?.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <p>Side effects information is not available for this medication.</p>
                )}
              </TabsContent>
              
              <TabsContent value="interactions" className="p-6">
                <h3 className="text-xl font-semibold mb-4">Drug Interactions</h3>
                
                {drug.interactions && drug.interactions.length > 0 ? (
                  <div className="space-y-6">
                    <p className="mb-4">
                      This medication may interact with the following drugs, medical conditions, or substances:
                    </p>
                    
                    <div className="space-y-4">
                      {drug.interactions.map((interaction, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex items-start">
                            <div className="bg-drugopedia-100 p-1 rounded-full mr-3">
                              <AlertTriangle className="h-4 w-4 text-drugopedia-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{interaction.name}</h4>
                              <p className="text-sm text-gray-600">{interaction.description}</p>
                              
                              {interaction.severity && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs text-white font-medium px-2 py-0.5 rounded bg-amber-500">
                                    {interaction.severity} Interaction
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Alert className="mt-4 border-drugopedia-300 bg-drugopedia-50">
                      <Star className="h-4 w-4 text-drugopedia-600" />
                      <AlertTitle>Important Note</AlertTitle>
                      <AlertDescription>
                        This list may not include all possible drug interactions. Please consult with your healthcare provider or pharmacist for personalized advice.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <p>Interaction information is not available for this medication.</p>
                )}
              </TabsContent>
            </Tabs>
          </FadeInSection>
          
          <FadeInSection delay={400}>
            <div className="bg-white rounded-xl shadow-md border p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              
              <Accordion type="single" collapsible className="w-full">
                {drug.pregnancy_category && (
                  <AccordionItem value="pregnancy">
                    <AccordionTrigger>Pregnancy & Lactation</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">
                        <span className="font-medium">Pregnancy Category:</span> {drug.pregnancy_category}
                      </p>
                      <p>{drug.pregnancy_info || 'No detailed information available for use during pregnancy.'}</p>
                      
                      {drug.lactation_info && (
                        <div className="mt-3">
                          <p className="font-medium mb-1">Breastfeeding:</p>
                          <p>{drug.lactation_info}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {drug.mechanism_of_action && (
                  <AccordionItem value="mechanism">
                    <AccordionTrigger>Mechanism of Action</AccordionTrigger>
                    <AccordionContent>
                      <p>{drug.mechanism_of_action}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {drug.pharmacokinetics && (
                  <AccordionItem value="pharmacokinetics">
                    <AccordionTrigger>Pharmacokinetics</AccordionTrigger>
                    <AccordionContent>
                      <p>{drug.pharmacokinetics}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {drug.contraindications && (
                  <AccordionItem value="contraindications">
                    <AccordionTrigger>Contraindications</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">This medication should not be used in the following conditions:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {typeof drug.contraindications === 'string' 
                          ? <li>{drug.contraindications}</li>
                          : drug.contraindications.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))
                        }
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {drug.storage_info && (
                  <AccordionItem value="storage">
                    <AccordionTrigger>Storage & Handling</AccordionTrigger>
                    <AccordionContent>
                      <p>{drug.storage_info}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={500}>
            <div className="bg-drugopedia-50 rounded-xl p-6 border border-drugopedia-100 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-drugopedia-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Medical Disclaimer</h3>
                  <p className="text-sm text-gray-600">
                    The information provided is for educational purposes only and is not intended as a substitute for medical advice from a healthcare professional. Consult with your doctor or pharmacist before starting, stopping, or changing the dose of any medication.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DrugDetail;
