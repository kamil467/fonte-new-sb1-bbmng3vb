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
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin size={20} className="mr-2 text-[#B49A5E]" />
                <span className="text-gray-400">Textile city warehouse #264 – Dubai</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-[#B49A5E]" />
                <span className="text-gray-400">+971 50 986 1949</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-[#B49A5E]" />
                <span className="text-gray-400">info@fonte.net</span>
              </li>
            </ul>
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