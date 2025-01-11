import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Menu, Phone, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Navigation items
  const navItems = [
    { title: 'Home', link: '/' },
    { title: 'Collections', link: '/products' },
    { title: 'Expertise', link: '/expertise' },
    { title: 'About us', link: '/about' },
    { title: 'Contact us', link: '/contact' },
  ];

  // Mobile Navigation Overlay
  const MobileNav = () => (
    <div className={`fixed inset-0 bg-white z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={toggleMobileMenu} className="p-2">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">MENU</h2>
        <div className="w-10"></div>
      </div>
      <nav className="p-4">
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.link}
                className="block py-2 text-lg hover:text-gray-600"
                onClick={toggleMobileMenu}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Top Bar */}
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

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white z-40 px-4 py-3 flex justify-between items-center border-b">
        <button onClick={toggleMobileMenu} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex-1 flex justify-center">
          <img 
            src="https://ik.imagekit.io/kamil467/fonte_logo-removebg.png?updatedAt=1736246322296" 
            alt="Fonte" 
            className="h-8" 
          />
        </Link>
        <div className="w-10"></div>
      </header>

      <MobileNav />

      {/* Desktop Navigation */}
      <nav className="bg-white shadow-md hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://ik.imagekit.io/kamil467/fonte_logo-removebg.png?updatedAt=1736246322296" 
                alt="Fonte" 
                className="h-12" 
              />
              <img 
                src="https://ik.imagekit.io/kamil467/Fonte/logo_text.png?updatedAt=1736279445015" 
                alt="Fonte" 
                className="h-12" 
              />
            </Link>
            <div className="flex space-x-8">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.link} 
                  className="text-black hover:text-[#B49A5E]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;