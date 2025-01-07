import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Description */}
          <div className="lg:col-span-2">
            <p className="text-gray-400 text-sm">
              Luxury furnishing solutions for discerning clients.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-400 hover:text-[#B49A5E] text-sm">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-[#B49A5E] text-sm">Collections</Link></li>
              <li><Link to="/expertise" className="text-gray-400 hover:text-[#B49A5E] text-sm">Expertise</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[#B49A5E] text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#B49A5E] text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Dubai Location */}
          <div className="lg:col-span-3">
            <div className="flex items-start space-x-2">
              <MapPin size={16} className="text-[#B49A5E] mt-1 flex-shrink-0" />
              <div className="text-gray-400 text-sm">
                <p className="font-semibold text-[#B49A5E]">Dubai</p>
                <p>WH 10, HEIRS OF LAHEJ KHALIFA AL BASHTI</p>
                <p>P.O.BOX: 128093, Dubai - UAE</p>
                <div className="flex items-center mt-1 space-x-4">
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#B49A5E]" />
                    <span>+971 43442736</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#B49A5E]" />
                    <span>+971 55654260</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sharjah Location */}
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-2">
              <MapPin size={16} className="text-[#B49A5E] mt-1 flex-shrink-0" />
              <div className="text-gray-400 text-sm">
                <p className="font-semibold text-[#B49A5E]">Sharjah</p>
                <p>Shop No. 1, Ground Floor</p>
                <p>Industrial Area 6, Sharjah - UAE</p>
                <div className="flex items-center mt-1">
                  <Phone size={14} className="mr-1 text-[#B49A5E]" />
                  <span>+968 92310740</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kochin Location */}
          <div className="lg:col-span-3">
            <div className="flex items-start space-x-2">
              <MapPin size={16} className="text-[#B49A5E] mt-1 flex-shrink-0" />
              <div className="text-gray-400 text-sm">
                <p className="font-semibold text-[#B49A5E]">Kochin</p>
                <p>Shop No. 145, First Floor</p>
                <p>Edapally, Kochin, Kerala - India</p>
                <div className="flex items-center mt-1 space-x-4">
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#B49A5E]" />
                    <span>+91 1234567890</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={14} className="mr-1 text-[#B49A5E]" />
                    <span>info@fonteid.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 mt-6 pt-4 border-t border-gray-800">
          <a href="https://www.facebook.com/fonteid" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B49A5E]">
            <Facebook size={20} />
          </a>
          <a href="https://www.instagram.com/fonteid" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B49A5E]">
            <Instagram size={20} />
          </a>
          <a href="mailto:info@fonteid.com" className="text-gray-400 hover:text-[#B49A5E]">
            <Mail size={20} />
          </a>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Fonte Furnishing LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;