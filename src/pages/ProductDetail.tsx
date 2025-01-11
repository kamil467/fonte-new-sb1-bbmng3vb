import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, Product, ProductColor, ProductCareInstruction } from '../lib/supabase';

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
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [careInstructions, setCareInstructions] = useState<ProductCareInstruction[]>([]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          colors:product_colors(*),
          care_instructions:product_care_instructions(*)
        `)
        .eq('id', id)
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-gray-900">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-gray-900">{product.collection}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{product.name}</span>
      </div>

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
              <div className="flex space-x-1 mb-8">
                <Tab 
                  title="Description"
                  active={activeTab === 'DESCRIPTION'} 
                  onClick={() => setActiveTab('DESCRIPTION')}
                >
                 {/* Description */} 
                </Tab>
                <Tab 
                  title="Specifications"
                  active={activeTab === 'SPECIFICATIONS'} 
                  onClick={() => setActiveTab('SPECIFICATIONS')}
                >
                {/* Specifications */}  
                </Tab>
                <Tab 
                  title="Care Instructions"
                  active={activeTab === 'CARE'} 
                  onClick={() => setActiveTab('CARE')}
                >
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
                      <span>{product.collection}</span>
                    </div>
                    <div className="flex justify-between border-b pb-4">
                      <span className="font-medium">COMPOSITION</span>
                      <span>{typeof product.composition === 'object' ? product.composition.main : product.composition}</span>
                    </div>
                    {typeof product.composition === 'object' && product.composition.embroidery && (
                      <div className="flex justify-between border-b pb-4">
                        <span className="font-medium">EMBROIDERY</span>
                        <span>{product.composition.embroidery}</span>
                      </div>
                    )}
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
                    <div>{product.collection}</div>
                    <div className="font-medium">Composition</div>
                    <div>{typeof product.composition === 'object' ? product.composition.main : product.composition}</div>
                    {typeof product.composition === 'object' && product.composition.embroidery && (
                      <>
                        <div className="font-medium">Embroidery</div>
                        <div>{product.composition.embroidery}</div>
                      </>
                    )}
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
          <button
            onClick={() => {
              const phoneNumber = '+97477948040';
              const productUrl = window.location.origin + window.location.pathname;
              const message = `Hello, I would like to request a quote for ${product.name} (${selectedColor}). Product Link: ${productUrl}`;
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="mt-8 bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944] text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Request Quote on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;