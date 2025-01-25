import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Menu, Phone, X, ChevronDown, Loader2, Globe } from 'lucide-react';
import { supabase, Category, SubCategory, Region, RegionCategoryMapping, RegionSubCategoryMapping } from '../lib/supabase';
import { RegionCode, getRegionIdFromCode, getRegionCodeFromId, getRegionFromLocation, updateUrlWithRegion, isValidRegionCode } from '../utils/regionUtils';

const Navbar = ({productGridRef}) => {
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
  const [openMobileCategories, setOpenMobileCategories] = useState<number[]>([]);
  const [menuButtonPressed, setMenuButtonPressed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // First fetch regions
  useEffect(() => {
    fetchRegions();
  }, []);

  // Then initialize region based on URL or location
  useEffect(() => {
    const initializeRegion = async () => {
      if (!regions.length) return;

      const pathParts = location.pathname.split('/');
      const urlRegionCode = pathParts[1];

      if (urlRegionCode && isValidRegionCode(urlRegionCode)) {
        // Valid region code in URL - use it
        const regionId = getRegionIdFromCode(urlRegionCode);
        const region = regions.find(r => r.id === regionId);
        if (region) {
          setSelectedRegion(region);
          // Fetch mappings immediately after setting region
          await handleRegionChange(region);
        }
      } else {
        // No valid region code in URL - detect from location
        const userRegion = await getRegionFromLocation();
        const regionId = getRegionIdFromCode(userRegion);
        const region = regions.find(r => r.id === regionId);
        if (region) {
          setSelectedRegion(region);
          updateUrlWithRegion(userRegion);
          // Fetch mappings immediately after setting region
          await handleRegionChange(region);
        }
      }
    };

    initializeRegion();
  }, [regions, location.pathname]);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (regionCategoryMappings.length > 0 || regionSubCategoryMappings.length > 0) {
      fetchCategoriesAndSubcategories();
    }
  }, [regionCategoryMappings, regionSubCategoryMappings]);

  const handleRegionChange = async (region: Region) => {
    if (!region) return;
    
    setLoading(true);
    setError(null);
    setCategories([]);
    setSubCategories([]);
    setRegionCategoryMappings([]);
    setRegionSubCategoryMappings([]);

    try {
      // Clear existing mappings
      // Fetch category mappings
      const { data: categoryMappings, error: categoryError } = await supabase
        .from('region_category_mapping')
        .select('*')
        .eq('region_id', region.id);

      if (categoryError) throw categoryError;

      // Fetch subcategory mappings
      const { data: subCategoryMappings, error: subCategoryError } = await supabase
        .from('region_subcategory_mapping')
        .select('*')
        .eq('region_id', region.id);

      if (subCategoryError) throw subCategoryError;

      // Set both mappings and fetch categories/subcategories
      setRegionCategoryMappings(categoryMappings || []);
      setRegionSubCategoryMappings(subCategoryMappings || []);

      if (categoryMappings?.length > 0) {
        const categoryIds = categoryMappings.map(mapping => mapping.category_id);
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .in('id', categoryIds)
          .order('order_index');

        if (categoriesError) throw categoriesError;
        setCategories(categories || []);
      }

      if (subCategoryMappings?.length > 0) {
        const subcategoryIds = subCategoryMappings.map(mapping => mapping.subcategory_id);
        const { data: subcategories, error: subcategoriesError } = await supabase
          .from('sub_categories')
          .select('*')
          .in('id', subcategoryIds)
          .order('order_index');

        if (subcategoriesError) throw subcategoriesError;
        setSubCategories(subcategories || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error during region change:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionSelect = async (region: Region) => {
    setSelectedRegion(region);
    setIsRegionDropdownOpen(false);
    // Fetch mappings immediately after selecting new region
    await handleRegionChange(region);
    navigate(`/${region.code}`);
  };

  const getRegionFromUrl = (): RegionCode => {
    const pathParts = location.pathname.split('/');
    const urlRegionCode = pathParts[1];
    if (urlRegionCode && isValidRegionCode(urlRegionCode)) {
      return urlRegionCode;
    }
    return selectedRegion?.code as RegionCode || 'global-en';
  };

  const getCategoryUrl = (categorySlug: string) => {
    const regionCode = selectedRegion?.code || getRegionFromUrl();
    return `/${regionCode}/products/${categorySlug}`;
  };

  const getSubCategoryUrl = (categorySlug: string, subCategorySlug: string) => {
    const regionCode = selectedRegion?.code || getRegionFromUrl();
    return `/${regionCode}/products/${categorySlug}/${subCategorySlug}`;
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

  const getSubCategories = (categoryId: number) => {
    return subcategories.filter(subcategory => subcategory.category_id === categoryId);
  };

  const toggleMobileCategory = (categoryId: number) => {
    toggleCategoryToOpenCloseMobile(categoryId);
    setOpenMobileCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    {/** TODO: Implement toggleCategoryToOpenCloseMobile */}
    
  };

  const handleMenuClick = () => {
    setMenuButtonPressed(true);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setTimeout(() => setMenuButtonPressed(false), 200);
  };

  const isCategoryActive = (categorySlug: string) => {
    return location.pathname.includes(`/products/${categorySlug}`);
  };

  {/** ToggleCategory For Mobile  */}
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const toggleCategoryToOpenCloseMobile = (id) => {
    console.log("toggleCategoryToOpenCloseMobile", id);
    // If the clicked category is already open, close it
    if (openCategoryId === id) {
        setOpenCategoryId(null);
    } else {
        setOpenCategoryId(id); // Open the clicked category
    }
};

  // Mobile Navigation Overlay
  const MobileNav = () => (
    <div
      className={`fixed inset-y-0 left-0 w-[280px] bg-white transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 hover:text-[#B49A5E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      
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
        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      {/* Mobile Navigation Content */}
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        {/* Region Selector */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
             
                <img src={selectedRegion?.icon_url} alt="Global" className="w-5 h-5 mr-2" />
              
              <span className="text-lg font-medium">{selectedRegion?.name || 'Select Region'}</span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transform transition-transform text-[#B49A5E] ${
                isRegionDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isRegionDropdownOpen && (
            <div className="bg-gray-50 py-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  className={`flex items-center w-full px-6 py-2 text-left transition-colors ${
                    selectedRegion?.id === region.id 
                      ? 'text-[#B49A5E] bg-[#B49A5E]/10' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    handleRegionSelect(region);
                    setIsRegionDropdownOpen(false);
                  }}
                >
                 
                    <img src={region.icon_url} alt="Global" className="w-5 h-5 mr-2" />
                
                  {region.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="py-2">
          {categories.map((category) => {
            const isOpen = openMobileCategories.includes(category.id);
            const categorySubcategories = subcategories.filter(
              sub => sub.category_id === category.id
            );

            return (
              <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                <button
                   className={`w-full text-left px-3 py-2 text-base font-medium ${
                    openCategoryId === category.id ? 'text-[#B49A5E]' : 'text-gray-700'
                } hover:text-gray-900 hover:bg-gray-50`}
                  onClick={() => toggleMobileCategory(category.id)}
                >
                  <span className={`text-lg font-medium ${isCategoryActive(category.slug) && window.innerWidth >= 1024 ? 'text-[#B49A5E]' : ''}`}>{category.name}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transform transition-transform text-[#B49A5E] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openCategoryId === category.id &&  (
                  <div className="bg-gray-50">
                    
                    {
                    categorySubcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        to={`/${selectedRegion?.code || ''}/products/${category.slug}/${subcategory.slug}`}
                        className="block px-6 py-3 hover:bg-gray-100 transition-colors"
                        onClick={() =>{ 
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Navigation Links */}
        <div className="border-t border-gray-100">
          <Link
            to={`/${selectedRegion?.code || ''}/contact`}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-lg">Free Consultation</span>
          </Link>
          <Link
            to={`/${selectedRegion?.code || ''}/expertise`}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-lg">Expertise</span>
          </Link>
          <Link
            to={`/${selectedRegion?.code || ''}/About`}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-lg">About Us</span>
          </Link>
          
          <Link
            to={`/${selectedRegion?.code || ''}/contact`}
            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-lg">Contact</span>
          </Link>
          
        </div>

        {/* Contact Information */}
        <div className="mt-auto border-t border-gray-100 p-4 space-y-3">
          {selectedRegion && (
            <>
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-[#B49A5E]" />
                <span>{selectedRegion.email_1}</span>
              </div>
              {selectedRegion.contact_no_1 && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-[#B49A5E]" />
                <span>{selectedRegion.contact_no_1}</span>
              </div>
              )}
            </>
              
          )}
        </div>
      </div>
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
      <div className="hidden bg-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
          {selectedRegion && selectedRegion.email_1 && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
           
              <span>{selectedRegion.email_1}</span> 
            </div> )}
            {selectedRegion && selectedRegion.contact_no_1 && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span> {selectedRegion.contact_no_1}</span>
            </div>
                )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/*  Hide this for feedback comment:-  Region Selector  
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
                              src={selectedRegion.icon_url}
                              alt={selectedRegion.name} width={48}
                              className="w-4 h-4" 
                            />
                        <span>{selectedRegion.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </>
                )}
              </button>
              {isRegionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {regions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => handleRegionSelect(region)}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                       
                          <img 
                          src={region.icon_url}
                         alt={region.name} 
                         className="w-4 h-4" 
                       />
                        
                        <span>{region.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            */}
            <span>|</span>
            <select className="bg-black text-white border-none focus:outline-none">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <button 
              onClick={handleMenuClick}
              className={`md:hidden p-2 transition-colors ${
                menuButtonPressed ? 'text-[#B49A5E]' : 'text-black hover:text-[#B49A5E]'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to={`/${selectedRegion?.code || ''}`} className="flex items-center">
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

            {/* Search Bar  - commented this feature for now */}
          {/*}  <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <input
                type="text"
                placeholder="Search Product"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
              />
            </div>
           */}
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm">
             
              <Link to={`/${selectedRegion?.code || ''}/contact`}  className="flex items-center  hover:text-[#B49A5E]">
                Free Consultation
              </Link>
              <Link 
                to={`/${selectedRegion?.code || ''}/projects`}
                className="flex items-center  hover:text-[#B49A5E]"
              >
                Projects
              </Link>
              <Link to={`/${selectedRegion?.code || ''}/expertise`} className="flex items-center  hover:text-[#B49A5E]">
                Expertise
              </Link>
              <Link to={`/${selectedRegion?.code || ''}/about`} className="flex items-center  hover:text-[#B49A5E]">
                {/*<span className="mr-2">360°</span>*/}
                About Us
              </Link>

              <Link to={`/${selectedRegion?.code || ''}/contact`} className="flex items-center  hover:text-[#B49A5E]">
                {/*<span className="mr-2">360°</span>*/}
               Contact
              </Link>
              <div className="hidden md:flex items-center space-x-4">
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
                              src={selectedRegion.icon_url}
                              alt={selectedRegion.name} width={48}
                              className="w-4 h-4" 
                            />
                     {/*  Hide this for feedback comment:-   <span>{selectedRegion.name}</span> */}
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
                        onClick={() => handleRegionSelect(region)}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                       
                          <img 
                          src={region.icon_url}
                         alt={region.name} 
                         className="w-4 h-4" 
                       />
                        
                        <span>{region.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
              {/*  Hide this for feedback comment:-   
            <span>|</span>
            <select className="bg-black text-white border-none focus:outline-none">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            */}
          </div>


            </div>
          </div>

          {/* Desktop Categories Menu */}
          {!loading ? (
            <div className="hidden md:flex justify-between items-center py-2 border-t">
              {getVisibleCategories().map((category) => (
                <div key={category.id} className="group relative">
                  <Link 
                    to={getCategoryUrl(category.slug)} 
                    className={`text-sm font-medium hover:text-gray-600 hover:border-b-2 hover:border-[#B49A5E] whitespace-nowrap px-4 py-2 ${
                      isCategoryActive(category.slug) && window.innerWidth >= 1024 ? 'text-[#B49A5E]' : ''
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
                            <div className="mt-4 hidden">
                              <Link 
                                to={getCategoryUrl(category.slug)} 
                                className="text-sm font-medium text-[#B49A5E] hover:text-[#8B7B4B] transition-colors inline-flex items-center"
                              >
                                Shop All
                                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-x-12 gap-y-4 px-8 ">
                            {getSubCategories(category.id).map((subCategory) => (
                              <Link
                                key={subCategory.id}
                                to={getSubCategoryUrl(category.slug, subCategory.slug)}
                                className="flex items-center space-x-3 py-1 group/item"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/${selectedRegion?.code || ''}/products/${category.slug}/${subCategory.slug}`);
                                  setTimeout(() => {
                                  if(productGridRef?.current)
                                  {
                                    console.log('Scrolling to product grid');
                                    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
                                  }
                                  else
                                  {
                                    console.log('productGridRef is not defined');
                                  }
                                  }, 100);

                                }}
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
                              to={getCategoryUrl(category.slug)}
                              className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${
                                isCategoryActive(category.slug) ? 'text-[#B49A5E]' : '' && window.innerWidth >= 1024
                              }`}
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
                                      to={getSubCategoryUrl(category.slug, subCategory.slug)}
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
                                  <Link hidden={true}
                                    to={getCategoryUrl(category.slug)}
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
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;