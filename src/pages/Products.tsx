import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Maximize2, X } from 'lucide-react';
import { supabase, Product as SupabaseProduct, ProductColor } from '../lib/supabase';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  collection: string;
}

const Products: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<(Product & { colors: ProductColor[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products with colors in a single query using Supabase's built-in join
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          colors:product_colors(*)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setProducts(productsData || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] bg-[#ffffff]">
        <div className="absolute inset-0">
          <img 
            src="https://ik.imagekit.io/kamil467/Fonte/bedsheet_7.jpeg?updatedAt=1736275811001"
            alt="Products Banner"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white text-center">Collections</h1>
        </div>
      </div>
      <div className="py-16 bg-[#B49A5E] bg-opacity-5">
        <div className="container mx-auto px-4">
          {/* View Mode Toggle */}
          <div className="flex justify-end mb-8">
            <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-white text-black' : 'text-gray-500'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-red-600 text-center py-8">
              {error}
              <button
                onClick={fetchProducts}
                className="ml-4 text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[7/4] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-8'
              }
            >
              {products.map((product) => (
                <div key={product.id} className="relative group">
                  <Link
                    to={`/products/productlist/${product.id}`}
                    className={`group ${viewMode === 'list' ? 'flex gap-8' : ''}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'aspect-[7/4]'}`}>
                      <img
                        src={product.colors[0]?.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className={viewMode === 'list' ? 'flex-1' : 'mt-4'}>
                      <h3 className="text-lg font-medium">{product.name}</h3>
                    </div>
                  </Link>
                  {viewMode === 'grid' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedImage(product.colors[0]?.image_url);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                    >
                      <Maximize2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] mx-4">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;