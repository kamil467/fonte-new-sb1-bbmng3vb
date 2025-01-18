import React, { useState, useEffect } from 'react';
import { Mail, Phone, X } from 'lucide-react';
import { Region, supabase } from '../lib/supabase';
import GoogleMap from '../components/GoogleMap';
import { useLocation } from 'react-router-dom';
import { getRegionIdFromCode, isValidRegionCode } from '../utils/regionUtils';


interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  is_ok_receive_communication: boolean;
  region_code: string;
  dialCode: string
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isError?: boolean;
}






// const regionCode = location.pathname.split('/')[1];






{/*const uaeMap = "https://maps.google.com/maps?q=FONTE%20GENERAL%20TRADING%20LLC&t=m&z=10&output=embed&iwloc=near";
const omanMap = "https://maps.google.com/maps?q=BLUE%20BIRD%20TRAVELS%20-%20SEEB&t=m&z=8&output=embed&iwloc=near";
const indiaMap= "https://maps.google.com/maps?q=Robodigx&t=m&z=8&output=embed&iwloc=near";
*/}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, isError = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-semibold ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {isError ? 'Error' : 'Success'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#B49A5E] text-white px-4 py-2 rounded hover:bg-[#776944] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Contact = () => {

  {/**  Fetch Region Data */}
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchRegionData();
  }, [location.pathname]);

  const fetchRegionData = async () => {
    try {
      const pathParts = location.pathname.split('/');
      const urlRegionCode = pathParts[1];

      if (urlRegionCode && isValidRegionCode(urlRegionCode)) {
        const regionId = getRegionIdFromCode(urlRegionCode);
        const { data: regionData, error } = await supabase
          .from('regions')
          .select('*')
          .eq('id', regionId)
          .single();

        if (error) throw error;
        setCurrentRegion(regionData);
      }
    } catch (error) {
      console.error('Error fetching region data:', error);
    }
  };





  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    region_code: '',
    is_ok_receive_communication: false,
    dialCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    isError: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegionChange = (regionCode: string) => {
    let dialCode = '';
    switch (regionCode) {
      case 'uae-en':
        dialCode = '+971';
        break;
      case 'ind-en':
        dialCode = '+91';
        break;
      case 'omn-en':
        dialCode = '+968';
        break;
      default:
        dialCode = '';
    }
    setFormData(prev => ({ ...prev, dialCode: dialCode }));
  };

  useEffect(() => {
    const updateRegionCode = () => {
      const regionCode = window.location.pathname.split('/')[1];
      setFormData(prev => ({ ...prev, region_code: regionCode }));
  
      handleRegionChange(regionCode); // Call your existing function to handle dial code
    };

    updateRegionCode(); // Initial call

    // Listen for changes in the URL
    window.addEventListener('popstate', updateRegionCode);
    
    return () => {
      window.removeEventListener('popstate', updateRegionCode);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
   
    const { dialCode, ...formDataForSubmision }  = formData;
    
    
    try {
      const { error } = await supabase
        .from('contactus_response')
        .insert([formDataForSubmision]);

      if (error) throw error;

      setModalState({
        isOpen: true,
        message: 'Thank you for reaching out! Our team will review your message and will contact you soon to discuss the next steps.',
        isError: false,
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        region_code: currentRegion?.code || 'global-en',
        is_ok_receive_communication: false,
        dialCode: dialCode
      });

    } catch (error) {
      setModalState({
        isOpen: true,
        message: 'Failed to submit. Please try again later.',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-[#B49A5E] bg-opacity-5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-4">
             {currentRegion?.enable_business_hours == true ? (
              <div>
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
              <div dangerouslySetInnerHTML={{ __html: currentRegion?.business_hours }} />
              </div>
            </div>
            ) :(<p></p>) }
            {currentRegion && currentRegion?.email_1 && (
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>{currentRegion?.email_1}</span>
                </div>
            )}
              {currentRegion && currentRegion?.email_2 && (
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>{currentRegion?.email_2}</span>
                </div>
              )}
                {currentRegion && currentRegion?.contact_no_1 && (
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>{currentRegion?.contact_no_1}</span>
                </div>
                )}
                {currentRegion && currentRegion?.contact_no_2 && (
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>{currentRegion?.contact_no_2}</span>
                </div>
                )}
                 {currentRegion && currentRegion?.whatsapp_no && (
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <a href={`https://wa.me/${currentRegion.whatsapp_no}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#B49A5E]">WhatsApp: {currentRegion.whatsapp_no}</a>
                </div>
                )}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email<span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="flex items-center">
                    {formData.region_code != 'global-en' && <span className="mr-2 text-gray-600">{formData.dialCode}</span>}
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone.replace(/^[^0-9]+/, '')}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message<span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={formData.is_ok_receive_communication}
                    onChange={(e) => 
                      setFormData({ ...formData, 
                        is_ok_receive_communication: e.target.checked
                         
                         })}
                  />
                  <label className="ml-2 text-sm">I agree to receive marketing communications from Fonte</label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#B49A5E] text-white px-6 py-3 rounded hover:bg-[#776944] transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Send Message'}
                </button>
              </form>
            </div>
           
          </div>

    
        {currentRegion?.code === 'uae-en' ? (<GoogleMap mapUrl={currentRegion?.map_url} />)
        : currentRegion?.code === 'omn-en' ? (<GoogleMap mapUrl={currentRegion?.map_url} />)
        : currentRegion?.code === 'ind-en' ? (<GoogleMap mapUrl={currentRegion?.map_url} />)
        :currentRegion?.code === 'global-en' && (
          <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-x-auto">
            {/* Dubai Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">UAE Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=FONTE%20GENERAL%20TRADING%20LLC&t=m&z=10&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonte Dubai Location"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Oman Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">Oman Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=BLUE%20BIRD%20TRAVELS%20-%20SEEB&t=m&z=8&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonte Oman Location"
                  className="rounded-lg"
                />
              </div>
            </div>

                     {/* Kerala location Location */}
                     <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">India Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=Robodigx&t=m&z=8&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonte India Location"
                  className="rounded-lg"
                />
              </div>
          
            </div>
          
          </div>
        </div>
        )}
        </div> 

      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        message={modalState.message}
        isError={modalState.isError}
      />
    </div>
  );
};

export default Contact;