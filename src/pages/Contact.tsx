import React, { useState } from 'react';
import { Mail, Phone, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isError?: boolean;
}

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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contactus_response')
        .insert([formData]);

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
              <div>
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>info@fonteid.net</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>fontetrade@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>+971 43442736 (UAE)/ +971 55654260 (UAE)</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>+968 92310740 (Oman)</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-[#B49A5E]" />
                  <span>+91 123456789 (India)</span>
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone<span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                  />
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
          <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-x-auto">
            {/* Dubai Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">UAE Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1804.3787633310155!2d55.30703873355741!3d25.24509059016152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f439940578155%3A0x9755b6b615831e7f!2sFONTE%20GENERAL%20TRADING%20LLC!5e0!3m2!1sen!2snl!4v1736245183166!5m2!1sen!2snl"
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.7792392667748!2d58.176206675731095!3d23.68385147871581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8de4cc6d0978f7%3A0x281c53712d20f98!2sBLUE%20BIRD%20TRAVELS%20-%20SEEB!5e0!3m2!1sen!2snl!4v1736248149981!5m2!1sen!2snl"
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.925697226994!2d76.30401307531902!3d10.022990390083564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080da8b1d0f263%3A0x409389047932793d!2sRobodigx!5e0!3m2!1sen!2sqa!4v1736274383560!5m2!1sen!2sqa"
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