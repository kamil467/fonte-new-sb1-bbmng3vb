import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Collections</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Link 
              key={index} 
              to={`/products/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-80 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[#B49A5E]">View Details</span>
                    <span className="text-gray-500">{product.category}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const products = [
  {
    id: 1,
    name: "Titanium Trim-1001",
    description: "Elegant border trim with geometric pattern",
    category: "Trimmings",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
  },
  // Add more products...
];

export default Products;