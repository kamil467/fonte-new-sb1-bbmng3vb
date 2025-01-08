import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, LayoutGrid, Grid } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

const Products: React.FC = () => {
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[40vh] bg-[#ffffff]"> {/* bg-[#776944] */}
        <div className="absolute inset-0">
          <img 
            src="https://ik.imagekit.io/kamil467/Fonte/bedsheet_7.jpeg?updatedAt=1736275811001"
            alt="Products Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white text-center">Collections</h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Filters and View Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-gray-600">12 Products found</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('large')}
                className={`p-2 rounded-lg ${viewMode === 'large' ? 'bg-gray-100' : ''}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-8 ${
            viewMode === 'list' ? 'grid-cols-1' : 
            viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 
            'grid-cols-1 md:grid-cols-2'
          }`}>
            {products.map((product, index) => (
              <Link key={index} to={`/products/${product.id}`} className="group">
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const products: Product[] = [
  {
    id: 1,
    name: "Amazon",
    description: "Elegant butterfly-themed cushion collection",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_1.jpeg?updatedAt=1736275811539"
  },
  {
    id: 2,
    name: "Belize",
    description: "Vibrant floral and striped patterns",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_2.jpeg?updatedAt=1736275811553"
  },
  {
    id: 3,
    name: "Celestial Harmony",
    description: "Modern abstract geometric designs",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_3.jpeg?updatedAt=1736275811539"
  },
  {
    id: 4,
    name: "Clovelly",
    description: "Delicate floral patterns in soft hues",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg?updatedAt=1736278429450"
  },
  {
    id: 5,
    name: "Positano",
    description: "Contemporary geometric patterns",
    image: "https://ik.imagekit.io/kamil467/Fonte/bedsheet_2.jpeg?updatedAt=1736275811337"
  },
  {
    id: 6,
    name: "Ryukyu",
    description: "Nature-inspired coastal designs",
    image: "https://ik.imagekit.io/kamil467/Fonte/bedsheet_3.jpeg?updatedAt=1736275811615"
  }
];

export default Products;