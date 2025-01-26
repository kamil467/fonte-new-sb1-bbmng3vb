import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Box, ChevronDown, ChevronRight, ChevronUp, FolderOpen, Home, Store, Tag } from 'lucide-react';
import { supabase, Category, SubCategory, Product, RegionCategoryMapping, RegionSubCategoryMapping, RegionProductMapping } from '../lib/supabase';


interface FilterGroup {
  name: string;
  isOpen: boolean;
  items: SubCategory[];
}

interface MappedProduct extends Product {
  region_product_mappings: RegionProductMapping[];
}

const Products = ({productGridRef}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regionCategoryMappings, setRegionCategoryMappings] = useState<RegionCategoryMapping[]>([]);
  const [regionSubCategoryMappings, setRegionSubCategoryMappings] = useState<RegionSubCategoryMapping[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  
  const { categorySlug, subcategorySlug } = useParams();
  const location = useLocation();
  const regionCode = location.pathname.split('/')[1];
 {/*} const productGridRef = useRef<HTMLDivElement>(null); */}
  useEffect(() => {
    fetchData();
  }, [regionCode]);

  useEffect(() => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
 
  useEffect(() => {
    if (categories.length > 0 && subcategories.length > 0 && regionCategoryMappings.length > 0 && regionSubCategoryMappings.length > 0) {
      organizeFilters();
      
      if (subcategorySlug) {
        const subcategory = subcategories.find(s => s.slug === subcategorySlug);
        if (subcategory) {
          setSelectedSubCategory(subcategory.id.toString());
          fetchProductsBySubcategory(subcategory.id);
        }
      } else if (categorySlug) {
        const category = categories.find(c => c.slug === categorySlug);
        if (category) {
          fetchProductsByCategory(category.id);
        }
      }
    }
  }, [categories, subcategories, regionCategoryMappings, regionSubCategoryMappings, categorySlug, subcategorySlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get region ID from code
      const { data: regionData, error: regionError } = await supabase
        .from('regions')
        .select('id')
        .eq('code', regionCode)
        .single();

      if (regionError) throw regionError;
      if (!regionData) throw new Error('Region not found');
      
      const regionId = regionData.id;

      // Fetch all required data
      const [
        categoriesData,
        subcategoriesData,
        regionCategoryData,
        regionSubCategoryData
      ] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('sub_categories').select('*'),
        supabase.from('region_category_mapping').select('*').eq('region_id', regionId),
        supabase.from('region_subcategory_mapping').select('*').eq('region_id', regionId)
      ]);

      if (categoriesData.error) throw categoriesData.error;
      if (subcategoriesData.error) throw subcategoriesData.error;
      if (regionCategoryData.error) throw regionCategoryData.error;
      if (regionSubCategoryData.error) throw regionSubCategoryData.error;

      setCategories(categoriesData.data);
      setSubcategories(subcategoriesData.data);
      setRegionCategoryMappings(regionCategoryData.data);
      setRegionSubCategoryMappings(regionSubCategoryData.data);

      // Fetch initial products if subcategory is specified
      if (subcategorySlug) {
        const subcategory = subcategoriesData.data.find(s => s.slug === subcategorySlug);
        if (subcategory) {
          await fetchProductsBySubcategory(subcategory.id);
        }
      } else if (categorySlug) {
        const category = categoriesData.data.find(c => c.slug === categorySlug);
        if (category) {
          await fetchProductsByCategory(category.id);
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const organizeFilters = () => {
    const regionCategoryIds = regionCategoryMappings.map(rcm => rcm.category_id);
    const regionSubCategoryIds = regionSubCategoryMappings.map(rscm => rscm.subcategory_id);

    // Filter categories and subcategories based on region mappings
    const filteredCategories = categories.filter(cat => regionCategoryIds.includes(cat.id));
    const filteredSubcategories = subcategories.filter(sub => regionSubCategoryIds.includes(sub.id));

    // Create the groups array with the selected category first
    let orderedCategories = [...filteredCategories];
    if (categorySlug) {
      const selectedCategory = filteredCategories.find(cat => cat.slug === categorySlug);
      if (selectedCategory) {
        orderedCategories = [
          selectedCategory,
          ...filteredCategories.filter(cat => cat.id !== selectedCategory.id)
        ];
      }
    }

    const groups: FilterGroup[] = orderedCategories.map(category => {
      const categorySubcategories = filteredSubcategories.filter(sub => sub.category_id === category.id);
      let orderedSubcategories = [...categorySubcategories];
      
      // If this is the selected category and we have a selected subcategory, put it first
      if (category.slug === categorySlug && subcategorySlug) {
        const selectedSubcategory = categorySubcategories.find(sub => sub.slug === subcategorySlug);
        if (selectedSubcategory) {
          orderedSubcategories = [
            selectedSubcategory,
            ...categorySubcategories.filter(sub => sub.id !== selectedSubcategory.id)
          ];
        }
      }

      return {
        name: category.name,
        isOpen: category.slug === categorySlug,
        items: orderedSubcategories
      };
    });

    setFilterGroups(groups);
  };

  const toggleGroup = (index: number) => {
    setFilterGroups(prev => prev.map((group, i) => ({
      ...group,
      isOpen: i === index ? !group.isOpen : group.isOpen
    })));
  };

  const handleSubCategorySelect = (subcategory: SubCategory) => {
    setSelectedSubCategory(subcategory.id.toString());
    fetchProductsBySubcategory(subcategory.id);
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    
    try {
      // Get region data
      const regionData = await supabase
        .from('regions')
        .select()
        .eq('code', regionCode)
        .single();

      if (!regionData.data) {
        throw new Error('Region not found');
      }

      // Get all subcategories for this category
      const { data: categorySubcategories, error: subcategoriesError } = await supabase
        .from('sub_categories')
        .select('id')
        .eq('category_id', categoryId);

      if (subcategoriesError) throw subcategoriesError;
      if (!categorySubcategories || categorySubcategories.length === 0) {
        setProducts([]);
        return;
      }

      // Get all products that belong to any of these subcategories that belong to region
      // product should be fetched if subcategories and product are allowed to display in the region
      const subcategoryIds = categorySubcategories.map(sub => sub.id);
      
     {/*commented bug code:*  const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          region_product_mapping!inner(region_id, product_id),
          region
        `)
        .eq('region_product_mapping.region_id', regionData.data.id)
        .in('subcategory_id', subcategoryIds)
        .eq('is_active', true);
   */}
   {/* Fixed data issue when fetching all products using for specific region and category */}
        const { data: products, error: productsError }= await supabase
        .from('products')
        .select(`
          *,
          region_product_mapping!inner (
           regions!inner (
               id
              )
            ),
          subcategory_id,
          sub_categories!inner (
            id,
            region_subcategory_mapping!inner (
              region_id
            )
          )
        `)
        .eq('region_product_mapping.regions.id', regionData.data.id) // Filter by region ID
        .eq('sub_categories. region_subcategory_mapping.region_id',regionData.data.id)
        .eq('sub_categories.category_id', categoryId); // Filter by category ID


      if (productsError) throw productsError;
      setProducts(products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const fetchProductsBySubcategory = async (subcategoryId: number) => {
    try {
      const regionData = await supabase
        .from('regions')
        .select()
        .eq('code', regionCode)
        .single();

      if (!regionData.data) {
        throw new Error('Region not found');
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          region_product_mapping!inner(region_id, product_id)
        `)
        .eq('region_product_mapping.region_id', regionData.data.id)
        .eq('subcategory_id', subcategoryId)
        .eq('is_active', true);

      if (productsError) throw productsError;
      setProducts(products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div  className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[50vh] bg-white">
        <div  className="absolute inset-0">
          <img 
            src={categories.find(c => c.slug === categorySlug)?.image_url}
            alt="Products Banner"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div  className="absolute inset-0 bg-black/30" /> {/* Overlay for better text visibility */}
        </div>
        <div   className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-light mb-4">{categories.find(c => c.slug === categorySlug)?.name}</h1>
          <p ref={productGridRef} className="text-lg text-gray-200 max-w-2xl text-center px-4">
            {categories.find(c => c.slug === categorySlug)?.description}
          </p>
        </div>
      </div>
 
      {/* Main Content */}

 {/* Breadcrumb Navigation */}
 <nav className="py-3 md:py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:block container mx-auto px-4">
          <div className="flex items-center space-x-3 text-base">
            <Link 
              to={`/${regionCode || ''}`} 
              className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              <span>Home</span>
            </Link>
          
            <span className="text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </span>

            <Link 
              to={`/${regionCode || ''}/products/${categorySlug}`} 
              className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
            >
              <Store className="w-5 h-5 mr-2" />
            
              <span>{categories.find(c => c.slug === categorySlug)?.name}</span>
            </Link>

            {subcategorySlug && (
              <>
                <span className="text-gray-400">
                  <ChevronRight className="w-5 h-5" />
                </span>
                <Link 
                    to={`/${regionCode || ''}/products/${categorySlug}/${subcategorySlug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
                >
                  <FolderOpen className="w-5 h-5 mr-2" />
                  <span>{subcategories.find(c => c.slug === subcategorySlug)?.name}</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Breadcrumb */}
        <div className="md:hidden container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <Link 
               to={`/${regionCode || ''}`} 
              className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />


            {categorySlug && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <Link 
                   to={`/${regionCode || ''}/products/${categorySlug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 bg-gray-50 px-2 py-0.5 rounded-full text-xs"
                >
                  {categories.find(c => c.slug === categorySlug)?.name}
                </Link>
              </>
            )}

       {subcategorySlug && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <Link 
                   to={`/${regionCode || ''}/products/${categorySlug}/${subcategorySlug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 bg-gray-50 px-2 py-0.5 rounded-full text-xs"
                >
                  {subcategories.find(c => c.slug === subcategorySlug)?.name}
                </Link>
              </>
            )}


          </div>
        </div>
      </nav>

      <div   className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col justify-center items-center md:flex-row gap-8">
          {/* Filters Sidebar - only visible on desktop */}
          {/*Hide this for feedback comment:- 
          <div className="hidden md:block w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24"> 
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-medium text-gray-900 text-center">Products</h2>
              </div>
              {filterGroups.map((group, index) => (
                <div 
                  key={index} 
                  className={`border-b border-gray-100 last:border-b-0 ${
                    group.isOpen ? 'bg-gray-50' : ''
                  }`}
                >
                  <button
                    className={`w-full flex items-center justify-between p-4 text-base hover:bg-gray-50 transition-colors ${
                      group.isOpen ? 'text-[#B49A5E] font-medium' : 'text-gray-900'
                    }`}
                    onClick={() => toggleGroup(index)}
                  >
                    <span className="font-medium">{group.name}</span>
                    {group.isOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {group.isOpen && (
                    <div className="px-4 pb-4">
                      {group.items.map(item => (
                        <label key={item.id} className="block">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={selectedSubCategory === item.id.toString()}
                            onChange={() => handleSubCategorySelect(item)}
                            className="w-4 h-4 text-[#B49A5E] border-gray-300 focus:ring-[#B49A5E]"
                          />
                          <span className={`ml-3 text-sm ${
                            selectedSubCategory === item.id.toString() 
                              ? 'text-[#B49A5E] font-medium' 
                              : 'text-gray-700'
                          }`}>{item.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          */}


  



          {/* Products Grid */}

       
    
          <div className="w-full flex-col  flex justify-center items-center md:w-3/4 ">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B49A5E] border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8 bg-red-50 rounded-lg">{error}</div>
            ) : products.length === 0 ? (
              <div className=" text-center py-12 px-4 bg-white rounded-lg border border-gray-100">
                <p className="text-lg text-gray-600">No products found for this category</p>
                <p className="text-sm text-gray-500 mt-2">Try selecting a different category or subcategory</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-[450px]">
                    <Link
                      to={`/${regionCode || ''}/products/${categorySlug}/${subcategorySlug}/${product.slug}?id=${product.id}`}
                      className="flex flex-col h-full"
                    >
                      <div className="relative h-[250px] bg-gray-100">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#B49A5E] transition-colors mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {product.description}
                        </p>
                     {/*   <p className="text-gray-800 font-bold group-hover:text-[#B49A5E] transition-colors">
                         Starting from ${product.price}
                        </p>
                        **/}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
           
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Products;