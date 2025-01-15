import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Menu, Phone, X, ChevronDown, Loader2 } from 'lucide-react';
import { supabase, Category, SubCategory, Region, RegionCategoryMapping, RegionSubCategoryMapping } from '../lib/supabase';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionCategoryMappings, setRegionCategoryMappings] = useState<RegionCategoryMapping[]>([]);
  const [regionSubCategoryMappings, setRegionSubCategoryMappings] = useState<RegionSubCategoryMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      handleRegionChange();
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (regionCategoryMappings.length > 0 || regionSubCategoryMappings.length > 0) {
      fetchCategoriesAndSubcategories();
    }
  }, [regionCategoryMappings, regionSubCategoryMappings]);

  const handleRegionChange = async () => {
    if (!selectedRegion) return;
    
    setLoading(true);
    setError(null);
    setCategories([]);
    setSubCategories([]);

    try {
      await fetchRegionMappings();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error during region change:', err);
      setLoading(false);
    }
  };

  const fetchCategoriesAndSubcategories = async () => {
    try {
      await Promise.all([fetchCategories(), fetchSubCategories()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      setError(errorMessage);
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionMappings = async () => {
    if (!selectedRegion) return;

    try {
      // Clear existing mappings
      setRegionCategoryMappings([]);
      setRegionSubCategoryMappings([]);

      // Fetch category mappings
      const { data: categoryMappings, error: categoryError } = await supabase
        .from('region_category_mapping')
        .select('*')
        .eq('region_id', selectedRegion.id);

      if (categoryError) throw categoryError;

      // Fetch subcategory mappings
      const { data: subCategoryMappings, error: subCategoryError } = await supabase
        .from('region_subcategory_mapping')
        .select('*')
        .eq('region_id', selectedRegion.id);

      if (subCategoryError) throw subCategoryError;

      // Set both mappings at once to trigger single effect
      setRegionCategoryMappings(categoryMappings || []);
      setRegionSubCategoryMappings(subCategoryMappings || []);
    } catch (err) {
      console.error('Error fetching region mappings:', err);
      setRegionCategoryMappings([]);
      setRegionSubCategoryMappings([]);
      throw err;
    }
  };

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setRegions(data || []);
      if (data && data.length > 0) {
        setSelectedRegion(data[0]);
      }
    } catch (err) {
      console.error('Error fetching regions:', err);
      setError('Failed to load regions');
    }
  };

const fetchRegionIcon = (id:number) =>{
   return id == 1 ? "icons/icons8-global.png" : 
    id == 2 ? "icons/icons8-uae.png" : 
    id == 3 ? "icons/icons8-oman.png":
    id == 4 ? "icons/icons8-india.png": "icons/icons8-global.png"
     
}



  const fetchCategories = async () => {
    if (!selectedRegion || !regionCategoryMappings.length) {
      setCategories([]);
      return;
    }

    try {
      const categoryIds = regionCategoryMappings.map(mapping => mapping.category_id);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .in('id', categoryIds)
        .order('order_index');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      throw err;
    }
  };

  const fetchSubCategories = async () => {
    if (!selectedRegion || !regionSubCategoryMappings.length) {
      setSubCategories([]);
      return;
    }

    try {
      const subcategoryIds = regionSubCategoryMappings.map(mapping => mapping.subcategory_id);
      
      const { data, error } = await supabase
        .from('sub_categories')
        .select('*')
        .in('id', subcategoryIds)
        .order('order_index');

      if (error) throw error;
      setSubCategories(data || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubCategories([]);
      throw err;
    }
  };

  const getMainCategories = () => {
    return categories.filter(category => !category.parent_id);
  };

  const getVisibleCategories = () => {
    return getMainCategories().slice(0, 6);
  };

  const getMoreCategories = () => {
    return getMainCategories().slice(6);
  };

  const getSubCategories = (parentId: number) => {
    return subcategories.filter(category => category.parent_id === parentId);
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
    <header className="bg-white">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>wecare@sedarglobal.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>+97444694442</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Region Selector */}
            <div className="relative">
              <button
                onClick={() => !loading && setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                disabled={loading}
                className={`flex items-center space-x-2 hover:text-gray-300 focus:outline-none ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {selectedRegion && (
                  <>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                       <img 
                              src={fetchRegionIcon(selectedRegion.id)}
                              alt={selectedRegion.name} width={48}
                              className="w-6 h-4" 
                            />
                        <span>{selectedRegion.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </>
                )}
              </button>
              {isRegionDropdownOpen && !loading && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {regions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => {
                          setSelectedRegion(region);
                          setIsRegionDropdownOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {
                          <img 
                          src={fetchRegionIcon(region.id)}
                         alt={region.name} 
                         className="w-6 h-4" 
                       />
                        }
                        <span>{region.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span>|</span>
            <select className="bg-black text-white border-none focus:outline-none">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
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
                About Us
              </Link>
              <Link to="/consultation" className="flex items-center">
                Free Consultation
              </Link>
              <Link to="/tools" className="flex items-center">
                Tools & Guides
              </Link>
              <Link to="/samples" className="flex items-center">
                Expertise
              </Link>
           
            </div>
          </div>

          {/* Desktop Categories Menu */}
          {!loading ? (
            <div className="hidden md:flex justify-between items-center py-4 border-t">
              {getVisibleCategories().map((category,index:number) => (
                <div key={category.id} className="group relative">
                  <Link 
                    to={`/products/${category.slug}`}
                    className={`text-sm font-medium hover:text-gray-600  hover:border-b-2 hover:border-[#B49A5E] whitespace-nowrap px-4 py-2 
                    `}
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
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10 10.586l3.293-3.293a1 1 0 011.414-1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
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
              <div className="relative group">
                <button 
                  className="text-sm font-medium hover:text-gray-600 whitespace-nowrap px-4 flex items-center"
                >
                  MORE
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {getMoreCategories().length > 0 && (
                      <>
                        {getMoreCategories().map((category) => (
                          <div key={category.id} className="group/category relative">
                            <Link 
                              to={`/products/${category.slug}`}
                              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {category.name}
                              {getSubCategories(category.id).length > 0 && (
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </Link>
                            {getSubCategories(category.id).length > 0 && (
                              <div className="absolute left-full top-0 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover/category:opacity-100 group-hover/category:visible transition-all duration-200">
                                <div className="py-2">
                                  {getSubCategories(category.id).map((subCategory) => (
                                    <Link
                                      key={subCategory.id}
                                      to={`/products/${category.slug}/${subCategory.slug}`}
                                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      {subCategory.icon_url && (
                                        <img 
                                          src={subCategory.icon_url} 
                                          alt="" 
                                          className="w-5 h-5 object-contain opacity-60 group-hover:opacity-100"
                                        />
                                      )}
                                      <span>{subCategory.name}</span>
                                    </Link>
                                  ))}
                                  <div className="border-t my-2"></div>
                                  <Link
                                    to={`/products/${category.slug}`}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-[#B49A5E] hover:text-[#8B7B4B]"
                                  >
                                    Shop All
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="border-t my-2"></div>
                      </>
                    )}
                    {/*}
                    <Link 
                      to="/about"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/contact"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Contact Us
                    </Link>
                    <Link 
                      to="/careers"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Careers
                    </Link>
                    <Link 
                      to="/blog"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Blog
                    </Link>
                    {/*}
                    <div className="border-t my-2"></div>
                    <Link 
                      to="/showroom"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Find Showroom
                    </Link>
                    <Link 
                      to="/consultation"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Book Consultation
                    </Link>
                    <Link 
                      to="/support"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Customer Support
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex justify-center items-center py-4 border-t">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading categories...</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      <MobileNav />
    </header>
  );
};

export default Navbar;