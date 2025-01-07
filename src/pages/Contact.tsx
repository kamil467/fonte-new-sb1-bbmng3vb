import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-16 bg-[#B49A5E] bg-opacity-5">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#776944]">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-[#776944]">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B49A5E] focus:border-[#B49A5E]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#B49A5E] text-white px-6 py-3 rounded-md hover:bg-[#776944] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Info and Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[#B49A5E]" />
                  <div className="ml-4">
                    <p className="text-gray-600">+971 43442736 (UAE) / +971 55654260 (UAE)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[#B49A5E]" />
                  <div className="ml-4">
                    <p className="text-gray-600">+968 92310740 (Oman)</p>
                  </div>

                  <div className="ml-4">
                    <p className="text-gray-600">+91 123456789 (India)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[#B49A5E]" />
                  <div className="ml-4">
                    <p className="text-gray-600">info@fonteid.com</p>
                    <p className="text-gray-600">fontetrade@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
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
  );
};

export default Contact;