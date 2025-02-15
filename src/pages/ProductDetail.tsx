import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ChevronRight, Maximize2, ChevronDown, ChevronUp, Phone, Home, Store, FolderOpen, Tag, Box, Ruler, X } from 'lucide-react';
import { supabase, Product, ProductColor, ProductCareInstruction, Region } from '../lib/supabase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

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

interface RoomDimensions {
  width: number;
  height: number;
  length: number;
}

const ROOM_BACKGROUNDS = [
  '/room-templates/living-room-1.jpg',
  '/room-templates/living-room-2.jpeg',
  '/room-templates/living-room-3.avif',
  '/room-templates/living-room-4.jpg'
];

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className={`fixed inset-0 transition-opacity bg-gray-500 ${
            isAnimating ? 'opacity-75' : 'opacity-0'
          }`} 
          aria-hidden="true"
          onClick={onClose}
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div 
          className={`inline-block w-full max-w-6xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6 ${
            isAnimating 
              ? 'opacity-100 translate-y-0 sm:scale-100' 
              : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          }`}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
            >
              <span className="sr-only">Close</span>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomVisualizer: React.FC<{ 
  productDimensions: { width: number; height: number; length: number };
  productImage: string;
}> = ({ productDimensions, productImage }) => {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_BACKGROUNDS[0]);
  const [roomDimensions, setRoomDimensions] = useState({ width: 400, height: 300, length: 400 });
  const [showResult, setShowResult] = useState(false);
  const [productPosition, setProductPosition] = useState({ x: 300, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitResult, setFitResult] = useState<{ fits: boolean; message: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if product fits in room
  const checkProductFit = () => {
    const fits = 
      productDimensions.width <= roomDimensions.width &&
      productDimensions.height <= roomDimensions.height &&
      productDimensions.length <= roomDimensions.length;

    const message = fits 
      ? "Product fits in the room!"
      : "Product is too large for the room dimensions.";

    setFitResult({ fits, message });
    setShowResult(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomDimensions(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const drawRoom = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    // Update canvas size based on container
    if (containerRef.current) {
      const container = containerRef.current;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    console.log('Drawing room with background:', selectedRoom);
    console.log('Product image URL:', productImage);

    // Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load room background
    const roomImg = new Image();
    
    roomImg.onload = () => {
      console.log('Room image loaded successfully:', selectedRoom);
      // Draw room with proper scaling
      const scale = Math.min(canvas.width / roomImg.width, canvas.height / roomImg.height);
      const scaledWidth = roomImg.width * scale;
      const scaledHeight = roomImg.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(roomImg, x, y, scaledWidth, scaledHeight);

      if (showResult && productImage && fitResult?.fits) {
        console.log('Loading product image:', productImage);
        
        // Load and draw product
        const productImg = new Image();
        
        productImg.onload = () => {
          console.log('Product image loaded successfully');
          
          // Calculate scale based on room dimensions
          // Assuming 1 meter in room = 100 pixels in canvas
          const PIXELS_PER_METER = 100;
          const roomWidthInPixels = roomDimensions.width * (PIXELS_PER_METER / 100);
          const scale = roomWidthInPixels / productDimensions.width;
          
          // Calculate product dimensions in pixels
          const productWidth = productDimensions.width * scale;
          const productHeight = (productImg.height / productImg.width) * productWidth;
          
          // Ensure product position is within canvas bounds
          const x = Math.min(Math.max(productPosition.x, productWidth/2), canvas.width - productWidth/2);
          const y = Math.min(Math.max(productPosition.y, productHeight/2), canvas.height - productHeight/2);
          
          // Draw a shadow under the product
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          
          ctx.drawImage(
            productImg,
            x - productWidth/2,
            y - productHeight/2,
            productWidth,
            productHeight
          );
          
          ctx.restore();
          
          // Draw guidelines
          if (isDragging) {
            ctx.save();
            ctx.strokeStyle = '#4CAF50';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            ctx.restore();
          }
        };

        productImg.onerror = (e) => {
          console.error('Error loading product image:', e);
          console.error('Failed product image URL:', productImg.src);
          ctx.fillStyle = '#ff000033';
          ctx.fillRect(
            productPosition.x - 50,
            productPosition.y - 50,
            100,
            100
          );
          ctx.fillStyle = '#ff0000';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Image Load Error', productPosition.x, productPosition.y);
        };

        productImg.src = productImage;
      }
    };

    roomImg.onerror = (e) => {
      console.error('Error loading room image:', e, selectedRoom);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Error loading room image', canvas.width/2, canvas.height/2);
    };

    roomImg.src = selectedRoom;
  };

  // Handle mouse/touch events for product positioning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showResult) return;
    setIsDragging(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setProductPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !showResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setProductPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Redraw after state update and layout changes
    setTimeout(() => {
      drawRoom();
    }, 100);
  };

  useEffect(() => {
    drawRoom();
  }, [selectedRoom, showResult, productPosition, isFullscreen]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Room Fit Checker</h3>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 rounded-full"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Template</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="/room-templates/living-room-1.jpg">Living Room 1</option>
                <option value="/room-templates/living-room-2.jpeg">Living Room 2</option>
                <option value="/room-templates/living-room-3.avif">Living Room 3</option>
                <option value="/room-templates/living-room-4.jpg">Living Room 4</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Width (cm)</label>
                <input
                  type="number"
                  value={roomDimensions.width}
                  onChange={(e) => setRoomDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Length (cm)</label>
                <input
                  type="number"
                  value={roomDimensions.length}
                  onChange={(e) => setRoomDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Height (cm)</label>
                <input
                  type="number"
                  value={roomDimensions.height}
                  onChange={(e) => setRoomDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Dimensions</label>
              <div className="text-sm text-gray-600">
                <p>Width: {productDimensions.width} cm</p>
                <p>Length: {productDimensions.length} cm</p>
                <p>Height: {productDimensions.height} cm</p>
              </div>
            </div>

            <button
              onClick={checkProductFit}
              className="w-full bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944]"
            >
              Check Fit
            </button>

            {fitResult && (
              <div className={`p-4 rounded-md ${fitResult.fits ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {fitResult.message}
                {fitResult.fits && (
                  <p className="text-sm mt-2">You can now drag the product in the room visualization!</p>
                )}
              </div>
            )}
          </div>

          <div 
            ref={containerRef}
            className={`relative bg-gray-100 rounded-lg overflow-hidden ${
              isFullscreen ? 'h-screen' : 'h-[600px]'
            }`}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            {showResult && fitResult?.fits && (
              <div className="absolute bottom-4 left-4 right-4 text-center bg-black bg-opacity-50 text-white p-2 rounded">
                Drag to position the product in the room
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface RoomDimensions {
  width: number;
  height: number;
  length: number;
}

const Room: React.FC<{
  dimensions: { width: number; height: number; length: number };
  productDimensions: { width: number; height: number; length: number };
  showProduct: boolean;
}> = ({ dimensions, productDimensions, showProduct }) => {
  return (
    <>
      {/* Room walls */}
      <mesh position={[0, dimensions.height / 2, 0]}>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.length]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.2} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[dimensions.width, dimensions.length]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Product */}
      {showProduct && (
        <mesh position={[0, productDimensions.height / 2, 0]}>
          <boxGeometry 
            args={[productDimensions.width, productDimensions.height, productDimensions.length]} 
          />
          <meshStandardMaterial color="#4a90e2" transparent opacity={0.6} />
        </mesh>
      )}
    </>
  );
};

const Scene: React.FC<{
  roomDimensions: { width: number; height: number; length: number };
  productDimensions: { width: number; height: number; length: number };
  showProduct: boolean;
}> = ({ roomDimensions, productDimensions, showProduct }) => {
  return (
    <Canvas style={{ width: '100%', height: '400px', background: '#f5f5f5' }}>
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls enableDamping />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Room 
        dimensions={roomDimensions}
        productDimensions={productDimensions}
        showProduct={showProduct}
      />
    </Canvas>
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
  const [isRoomVisualizerOpen, setIsRoomVisualizerOpen] = useState(false);

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

  const getProductImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    
    // If it's already a full URL, return it
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a Supabase storage path, get the public URL
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(imageUrl);
      
    return data?.publicUrl || '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
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
      <div className="container mx-auto px-4 py-24">
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

  // Add default product dimensions (you can update these later with actual values from Supabase)
  const defaultProductDimensions = {
    width: 100,  // cm
    height: 150, // cm
    length: 50   // cm
  };

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
          <div className="relative">
            <img
              src={selectedImage || product.image_url}
              alt={product.name}
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
            <button
    onClick={() => setIsRoomVisualizerOpen(true)}
    className="bg-[#FFC107] text-white rounded-full p-4 shadow-lg hover:bg-[#776944] transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B49A5E] bounce"
    title="Check Room Fit"
  >
    <Ruler className="w-8 h-8 text-white" />
    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-sm py-1 px-2 rounded">
      Check Room Fit
    </span>
  </button>
  <span className="absolute bottom-16 right-0 mb-2 bg-[#FFC107] text-white text-sm py-1 px-2 rounded">
    Try our Room Fit Checker!
  </span>
            </div>
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

      {/* Room Visualizer Modal */}
      <Modal
        isOpen={isRoomVisualizerOpen}
        onClose={() => setIsRoomVisualizerOpen(false)}
      >
        <RoomVisualizer
          productDimensions={defaultProductDimensions}
          productImage={getProductImageUrl(selectedImage || product.image_url)}
        />
      </Modal>
    </div>
  );
};

export default ProductDetail;