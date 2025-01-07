import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Navbar = () => {
  return (
    <>
      <div className="bg-black text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Mail size={16} className="mr-2" />
              info@fonteid.net
            </span>
            <span className="flex items-center">
              <Phone size={16} className="mr-2" />
              +971 43442736 (UAE)
            </span>
          </div>
        </div>
      </div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="https://ik.imagekit.io/kamil467/fonte_logo-removebg.png?updatedAt=1736246322296" 
                   alt="Fonte" 
                   className="h-12" />
            </Link>
            <div className="flex space-x-8">
              <Link to="/" className="text-black hover:text-[#B49A5E]">Home</Link>
              <Link to="/products" className="text-black hover:text-[#B49A5E]">Collections</Link>
              <Link to="/expertise" className="text-black hover:text-[#B49A5E]">Expertise</Link>
              <Link to="/about" className="text-black hover:text-[#B49A5E]">About Us</Link>
              <Link to="/contact" className="text-black hover:text-[#B49A5E]">Contact</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;