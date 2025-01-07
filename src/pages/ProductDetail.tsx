import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  // This would typically fetch product data based on the ID
  const product = {
    id: 1,
    name: "Titanium Trim-1001",
    description: "Elegant border trim with geometric pattern",
    specifications: {
      reference: "TRM-1001",
      collection: "Titanium",
      composition: "100% COTTON",
      embComposition: "70% VISCOSE + 30% LUREX",
      technique: "CAD EMBROIDERY",
      width: "3 INCHES"
    },
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
      // Add more images
    ]
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.images[0]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4">
                    <div className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-[#B49A5E] text-white px-8 py-3 rounded-md hover:bg-[#776944] transition-colors">
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;