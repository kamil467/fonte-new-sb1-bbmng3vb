import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Menu, Phone, X } from 'lucide-react';
import { supabase, Category , SubCategory} from '../lib/supabase';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const[subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

const fetchSubCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .order('order_index');
      console.log(data);
    if (error) throw error;
    setSubCategories(data || []);
  } catch (err) {
    console.error('Error fetching sub categories:', err);
  } finally {
    setLoading(false);
  }
};


  const getMainCategories = () => {
    return categories.filter(category => !category.parent_id);
  };

  const getSubCategories = (parentId: number) => {
    // return categories.filter(category => category.parent_id === parentId);
    return  subcategories.filter(category => category.parent_id === parentId);
  };

  // Mobile Navigation Overlay
  const MobileNav = () => (
    <div className={`fixed inset-0 bg-white z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
            <X className="w-6 h-6" />
          </button>
          <span className="ml-4 text-xl">Login & Sign Up</span>
        </div>
      </div>

      <nav className="p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <ul className="space-y-4">
            {getMainCategories().map((category) => (
              <li key={category.id} className="border-b pb-2">
                <Link 
                  to={`/products/${category.slug}`}
                  className="block py-2 text-lg hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {loading ? (
                  <div className="pl-4 py-2 text-gray-500">Loading...</div>
                ) : (
                  <ul className="pl-4 mt-2 space-y-2">
                    {getSubCategories(category.id).map((subCategory) => (
                      <li key={subCategory.id}>
                        <Link
                          to={`/products/${category.slug}/${subCategory.slug}`}
                          className="block py-1 text-gray-600 hover:text-gray-900"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subCategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-sm">FREE DELIVERY & INSTALLATION ON CURTAINS & BLINDS</span>
          </div>
          <div className="flex items-center space-x-8">
            <span className="flex items-center">
              <Phone size={16} className="mr-2" />
              Call Us +97444694442
            </span>
            <span className="flex items-center">
              <Mail size={16} className="mr-2" />
              wecare@sedarglobal.com
            </span>
            <Link to="/store-locator" className="flex items-center">
              Find Your Store
            </Link>
            <Link to="/contact" className="flex items-center">
              Contact Us
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/qa-flag.png" alt="Qatar" className="w-6 h-4" />
              <span>QAT</span>
            </div>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
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

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <input
                type="text"
                placeholder="Search Product"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/virtual-store" className="flex items-center">
                <span className="mr-2">360°</span>
                Virtual Store
              </Link>
              <Link to="/consultation" className="flex items-center">
                Free Consultation
              </Link>
              <Link to="/tools" className="flex items-center">
                Tools & Guides
              </Link>
              <Link to="/samples" className="flex items-center">
                Free Sample
              </Link>
              <Link to="/login" className="flex items-center">
                Login
              </Link>
              <Link to="/cart" className="flex items-center">
                Cart
              </Link>
            </div>
          </div>

          {/* Desktop Categories Menu */}
          {!loading && (
            <div className="hidden md:flex justify-between items-center py-4 border-t">
              {getMainCategories().map((category) => (
                <div key={category.id} className="group relative">
                  <Link 
                    to={`/products/${category.slug}`}
                    className={`text-sm font-medium hover:text-gray-600 whitespace-nowrap px-4 py-2 ${
                      category.slug === 'curtains-and-drapes' ? 'border-b-2 border-[#B49A5E]' : ''
                    }`}
                  >
                    {category.name}
                  </Link>
                  {getSubCategories(category.id).length > 0 && (
                    <div className="fixed left-0 right-0 mt-2 bg-white border-y shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="max-w-[1440px] mx-auto px-4">
                        <div className="flex py-8">
                          <div className="w-[260px]">
                            <h2 className="text-3xl font-light">{category.name}</h2>
                            <div className="mt-4">
                              <Link
                                to={`/products/${category.slug}`}
                                className="text-sm font-medium text-[#B49A5E] hover:text-[#8B7B4B] transition-colors inline-flex items-center"
                              >
                                Shop All
                                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-x-12 gap-y-4 px-8">
                            {getSubCategories(category.id).map((subCategory) => (
                              <Link
                                key={subCategory.id}
                                to={`/products/${category.slug}/${subCategory.slug}`}
                                className="flex items-center space-x-3 py-1 group/item"
                              >
                                {subCategory.icon_url && (
                                  <img 
                                    src={subCategory.icon_url} 
                                    alt="" 
                                    className="w-6 h-6 object-contain opacity-60 group-hover/item:opacity-100"
                                  />
                                )}
                                <span className="text-sm text-gray-600 group-hover/item:text-gray-900">
                                  {subCategory.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="w-[300px]">
                            {category.image_url && (
                              <div className="aspect-[4/3] overflow-hidden">
                                <img 
                                  src={category.image_url} 
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link 
                to="/projects"
                className="text-sm font-medium hover:text-gray-600 whitespace-nowrap px-4"
              >
                PROJECTS
              </Link>
              <button 
                className="text-sm font-medium hover:text-gray-600 whitespace-nowrap px-4 flex items-center"
              >
                MORE...
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      <MobileNav />
    </>
  );
};

export default Navbar;