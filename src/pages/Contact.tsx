import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
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
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-[#B49A5E] mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">Textile city warehouse #264 – Dubai</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-[#B49A5E] mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+971 50 986 1949</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-[#B49A5E] mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@fonte.net</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;