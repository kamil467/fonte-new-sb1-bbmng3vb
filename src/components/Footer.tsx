import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="https://ik.imagekit.io/kamil467/fonte_logo.jpeg?updatedAt=1736186947621" 
              alt="Fonte" 
              className="h-12 mb-4"
            />
            <p className="text-gray-400">
              Luxury furnishing solutions for discerning clients. Premium fabrics and expert craftsmanship.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-[#B49A5E]">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-[#B49A5E]">Collections</Link></li>
              <li><Link to="/expertise" className="text-gray-400 hover:text-[#B49A5E]">Expertise</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[#B49A5E]">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#B49A5E]">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Showrooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dubai Location */}
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="mr-2 text-[#B49A5E] mt-1 flex-shrink-0" />
                  <div className="text-gray-400">
                    <p className="font-semibold text-[#B49A5E]">Dubai</p>
                    <p>WH 10, HEIRS OF LAHEJ KHALIFA AL BASHTI</p>
                    <p>P.O.BOX: 128093</p>
                    <p>Dubai - UAE</p>
                  </div>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center">
                    <Phone size={20} className="mr-2 text-[#B49A5E] flex-shrink-0" />
                    <span className="text-gray-400 whitespace-nowrap">+971 43442736 (UAE)</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="mr-2 text-[#B49A5E] flex-shrink-0" />
                    <span className="text-gray-400 whitespace-nowrap">+971 55654260 (UAE)</span>
                  </div>
                </div>
              </div>

              {/* Sharjah Location */}
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="mr-2 text-[#B49A5E] mt-1 flex-shrink-0" />
                  <div className="text-gray-400">
                    <p className="font-semibold text-[#B49A5E]">Sharjah</p>
                    <p>Shop No. 1, Ground Floor</p>
                    <p>Industrial Area 6</p>
                    <p>Sharjah - UAE</p>
                  </div>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center">
                    <Phone size={20} className="mr-2 text-[#B49A5E] flex-shrink-0" />
                    <span className="text-gray-400 whitespace-nowrap">+968 92310740 (Oman)</span>
                  </div>
                </div>
              </div>

              {/* Kochin Location - Full Width */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="mr-2 text-[#B49A5E] mt-1 flex-shrink-0" />
                  <div className="text-gray-400">
                    <p className="font-semibold text-[#B49A5E]">Kochin</p>
                    <p>Shop No. 145, First Floor</p>
                    <p>Edapally</p>
                    <p>Kochin, Kerala - India</p>
                  </div>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center">
                    <Phone size={20} className="mr-2 text-[#B49A5E] flex-shrink-0" />
                    <span className="text-gray-400 whitespace-nowrap">+91 1234567890 (India)</span>
                  </div>
                </div>
              </div>

              {/* Email - Full Width */}
              <div className="md:col-span-2 pl-7">
                <div className="flex items-center">
                  <Mail size={20} className="mr-2 text-[#B49A5E] flex-shrink-0" />
                  <span className="text-gray-400">info@fonteid.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#B49A5E]">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#B49A5E]">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Fonte Furnishing LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;