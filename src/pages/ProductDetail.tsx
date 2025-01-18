import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ChevronRight, Maximize2, ChevronDown, ChevronUp, Phone, Home, Store, FolderOpen, Tag, Box } from 'lucide-react';
import { supabase, Product, ProductColor, ProductCareInstruction, Region } from '../lib/supabase';

interface TabProps {
  title: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isMobile?: boolean;
}

const Tab: React.FC<TabProps> = ({ title, active, onClick, children, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="border-b">
        <button
          onClick={onClick}
          className="w-full px-4 py-3 flex justify-between items-center"
        >
          <span className="font-medium">{title}</span>
          {active ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <div className={`px-4 pb-4 ${active ? 'block' : 'hidden'}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onClick}
        className={`px-8 py-4 font-medium ${
          active ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {title}
      </button>
      <div className={active ? 'block' : 'hidden'}>
        {children}
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('id');
  const regionCode = location.pathname.split('/')[1];
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [careInstructions, setCareInstructions] = useState<ProductCareInstruction[]>([]);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    fetchProductDetails();
    fetchRegionDetails();
  }, [productId, regionCode]);

  const fetchProductDetails = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          subcategories:subcategory_id(
            id,
            name,
            slug,
            categories:category_id(
              id,
              name,
              slug
            )
          ),
          colors:product_colors(*),
          care_instructions:product_care_instructions(*)
        `)
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      if (!productData) throw new Error('Product not found');

      setProduct(productData);
      setColors(productData.colors || []);
      setCareInstructions(productData.care_instructions || []);
      setSelectedColor(productData.colors?.[0]?.color_code || null);

    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionDetails = async () => {
    if (!regionCode) return;
    
    try {
      const { data: regionData, error: regionError } = await supabase
        .from('regions')
        .select('*')
        .eq('code', regionCode)
        .single();

      if (regionError) throw regionError;
      if (regionData) {
        setRegion(regionData);
      }
    } catch (err) {
      console.error('Error fetching region details:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image skeleton */}
              <div className="w-full md:w-2/3">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
                <div className="flex gap-4 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              {/* Content skeleton */}
              <div className="w-full md:w-1/3">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={fetchProductDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedImage = colors.find(c => c.color_code === selectedColor)?.image_url;

  return (
    <div className="container mx-auto px-4 py-8">
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
              to={`/${regionCode || ''}/products/${product.subcategories?.categories?.slug}`} 
              className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
            >
              <Store className="w-5 h-5 mr-2" />
              <span>Products</span>
            </Link>

            {product.subcategories?.category && (
              <>
                <span className="text-gray-400">
                  <ChevronRight className="w-5 h-5" />
                </span>
                <Link 
                  to={`/${regionCode || ''}/products/${product.subcategories?.categories?.slug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
                >
                  <FolderOpen className="w-5 h-5 mr-2" />
                  <span>{product.subcategories?.category?.name}</span>
                </Link>
              </>
            )}

            {product.subcategories && (
              <>
                <span className="text-gray-400">
                  <ChevronRight className="w-5 h-5" />
                </span>
                <Link 
                 to={`/${regionCode || ''}/products/${product.subcategories?.categories?.slug}/${product.subcategories?.slug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
                >
                  <Tag className="w-5 h-5 mr-2" />
                  <span>{product.subcategories?.name}</span>
                </Link>
              </>
            )}

            <span className="text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </span>

            <span className="text-[#B49A5E] font-medium flex items-center">
              <Box className="w-5 h-5 mr-2" />
              <span className="truncate max-w-xs">{product?.name}</span>
            </span>
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

            <Link 
              to={`/${regionCode || ''}/products/${product.subcategories?.categories?.slug}`} 
              className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 flex items-center"
            >
              <Store className="w-4 h-4" />
            </Link>

            {product.subcategories?.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <Link 
                   to={`/${regionCode || ''}/products/${product.subcategories?.categories?.slug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 bg-gray-50 px-2 py-0.5 rounded-full text-xs"
                >
                  {product.subcategories?.category?.name}
                </Link>
              </>
            )}

            {product.subcategories && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <Link 
                 to={`/${regionCode || ''}/products/${product.subcategories?.categories?.slug}/${product.subcategories?.slug}`} 
                  className="text-gray-500 hover:text-[#B49A5E] transition-colors duration-200 bg-gray-50 px-2 py-0.5 rounded-full text-xs"
                >
                  {product.subcategories?.name}
                </Link>
              </>
            )}

            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            
            <span className="text-[#B49A5E] font-medium bg-[#B49A5E]/10 px-2 py-0.5 rounded-full text-xs truncate max-w-[120px]">
              {product?.name}
            </span>
          </div>
        </div>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <div>
          <div className="relative aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Color Variants */}
          <div className="grid grid-cols-4 gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.color_code)}
                className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                  selectedColor === color.color_code ? 'ring-2 ring-black' : ''
                }`}
              >
                <img
                  src={color.image_url}
                  alt={`${product.name} ${color.color_code}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded">
                  {color.color_code}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <h1 className="text-4xl font-medium mb-4">{product.name}</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-700">{product.description}</p>
            
            <p className="text-gray-600 italic text-sm">
              Please note that while we strive to accurately represent our products online, 
              the actual sample may vary slightly from the screen image due to factors such 
              as lighting and screen resolution.
            </p>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-16">
            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <div className="flex space-x-1 mb-8 " >
                <Tab 
                  title="Description"
                  active={activeTab === 'DESCRIPTION'}
                  onClick={() => setActiveTab('DESCRIPTION')} children={undefined}                >
                 {/* Description */} 
                </Tab>
                <Tab 
                  title="Specifications"
                  active={activeTab === 'SPECIFICATIONS'}
                  onClick={() => setActiveTab('SPECIFICATIONS')} children={undefined}                >
                {/* Specifications */}  
                </Tab>
                <Tab 
                  title="Care Instructions"
                  active={activeTab === 'CARE'}
                  onClick={() => setActiveTab('CARE')} children={undefined}                >
                 {/* Care Instructions */} 
                </Tab>
              </div>

              <div className="bg-[#f7f6f6] p-8">
                {activeTab === 'DESCRIPTION' && (
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">REFERENCE</span>
                      <span>{product.reference}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">COLLECTION</span>
                      <span>{product.subcategories?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">COMPOSITION</span>
                      <span>{product.composition || 'N/A'}</span>
                    </div>
                      
                 
                  </div>
                )}

                {activeTab === 'SPECIFICATIONS' && (
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">TECHNIQUE</span>
                      <span>{product.technique}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">WIDTH</span>
                      <span>{product.width}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">WEIGHT</span>
                      <span>{product.weight}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">MARTINDALE</span>
                      <span>{product.martindale}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">REPEATS</span>
                      <span>{product.repeats}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">END USE</span>
                      <span>{product.end_use}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'CARE' && (
                  <div className="space-y-4">
                    {careInstructions.map((instruction) => (
                      <div key={instruction.id} className="flex justify-between border-b pb-4">
                        <span className="font-medium">{instruction.icon}</span>
                        <span>{instruction.instruction}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Accordion Tabs */}
            <div className="md:hidden bg-[#f7f6f6]">
              <Tab
                title="Description"
                active={activeTab === 'DESCRIPTION'}
                onClick={() => setActiveTab(activeTab === 'DESCRIPTION' ? '' : 'DESCRIPTION')}
                isMobile
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="font-medium">Reference</div>
                    <div>{product.reference}</div>
                    <div className="font-medium">Collection</div>
                    <div>{product.subcategories?.name || 'N/A'}</div>
                    <div className="font-medium">Composition</div>
                        <div>{product.composition || 'N/A'}</div>
                 
                  </div>
                </div>
              </Tab>

              <Tab
                title="Specifications"
                active={activeTab === 'SPECIFICATIONS'}
                onClick={() => setActiveTab(activeTab === 'SPECIFICATIONS' ? '' : 'SPECIFICATIONS')}
                isMobile
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="font-medium">Width</div>
                    <div>{product.width}</div>
                    <div className="font-medium">Weight</div>
                    <div>{product.weight}</div>
                    <div className="font-medium">Martindale</div>
                    <div>{product.martindale}</div>
                    <div className="font-medium">End Use</div>
                    <div>{product.end_use}</div>
                  </div>
                </div>
              </Tab>

              <Tab
                title="Care Instructions"
                active={activeTab === 'CARE'}
                onClick={() => setActiveTab(activeTab === 'CARE' ? '' : 'CARE')}
                isMobile
              >
                <ul className="list-disc pl-4 space-y-2">
                  {careInstructions.map((instruction, index) => (
                    <li key={index}>{instruction.instruction}</li>
                  ))}
                </ul>
              </Tab>
            </div>
          </div>

          {/* WhatsApp Button */}
          {region?.whatsapp_no && (
            <div className="mt-6">
              <a
                href={`https://wa.me/${region.whatsapp_no}?text=I'm interested in the product: ${product?.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944] text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact via WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;