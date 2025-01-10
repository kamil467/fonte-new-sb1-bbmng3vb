import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ChevronRight, Maximize2 } from 'lucide-react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 text-sm font-medium ${
      isActive 
        ? 'bg-white text-black' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const ProductDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState('C-1');
  const location = useLocation();

  const specifications = {
    REFERENCE: 'TRM 1001',
    COLLECTION: 'Titanium',
    COMPOSITION: '100% COTTON',
    'EMB COMPOSITION': '70% VISCOSE + 30% LUREX',
    TECHNIQUE: 'CAD EMBRIODERY',
    WIDTH: '3 INCHES',
  };

  const cautions = [
    { icon: 'P', text: 'DRY CLEAN ONLY' },
    { icon: '⟰', text: 'MILD IRON' },
    { icon: '✕', text: 'DO NOT BLEACH' },
    { icon: '⊗', text: 'DO NOT TUMBLE DRY' },
  ];

  const details = {
    WEIGHT: '81 GSM',
    MARTINDALE: 'NA',
    REPEATS: 'NA',
    'END USE': 'BORDERS',
  };

  const colorVariants = [
    { id: 'C-1', image: 'https://ik.imagekit.io/kamil467/Fonte/curtain_1.jpeg?updatedAt=1736275811539' },
    { id: 'C-2', image: 'https://ik.imagekit.io/kamil467/Fonte/curtain_2.jpeg?updatedAt=1736275811553' },
    { id: 'C-4', image: 'https://ik.imagekit.io/kamil467/Fonte/curtain_3.jpeg?updatedAt=1736275811539' },
    { id: 'C-6', image: 'https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg?updatedAt=1736278429450' },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '+97477948040';
    const productUrl = window.location.origin + location.pathname;
    const message = `Hello, I would like to request a quote for Titanium Trm-1001 (${selectedColor}). Product Link: ${productUrl}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
        <ChevronRight size={16} />
        <Link to="/products" className="text-gray-600 hover:text-black">Products</Link>
        <ChevronRight size={16} />
        <Link to="/products/titanium" className="text-gray-600 hover:text-black">Titanium</Link>
        <ChevronRight size={16} />
        <Link to="/products/titanium/trm-1001" className="text-gray-600 hover:text-black">Trm 1001</Link>
        <ChevronRight size={16} />
        <span className="text-black">Titanium Trm-1001</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <div>
          <div className="relative bg-gray-100 mb-6">
            <div className="aspect-[16/9] overflow-hidden">
              <img 
                src={colorVariants.find(v => v.id === selectedColor)?.image} 
                alt="Product"
                className="w-full h-full object-contain"
              />
            </div>
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg">
              <Maximize2 size={20} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {colorVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedColor(variant.id)}
                className={`relative aspect-square bg-gray-100 overflow-hidden ${
                  selectedColor === variant.id ? 'ring-2 ring-black' : ''
                }`}
              >
                <img 
                  src={variant.image} 
                  alt={`TRM-1001 ${variant.id}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 text-[10px] bg-white px-1 rounded">
                  TRM-1001 {variant.id}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <h1 className="text-4xl font-medium mb-4">Titanium Trm-1001</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-700">
              Titanium brings elegance with its intricate geometric patterns to the Collection. 
              The sophisticated designs in different colors create stunning visual contrasts. 
              The product is perfect for borders, trims, and decorative elements.
            </p>
            
            <p className="text-gray-600 italic text-sm">
              Please note that while we strive to accurately represent our products online, 
              the actual sample may vary slightly from the screen image due to factors such 
              as lighting and screen resolution.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6">
            {['DESCRIPTION', 'SPECIFICATIONS', 'CAUTION'].map((tab) => (
              <Tab
                key={tab}
                label={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-8">
            {activeTab === 'DESCRIPTION' && (
              <div className="space-y-4">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-4">
                    <span className="font-medium">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'SPECIFICATIONS' && (
              <div className="space-y-4">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-4">
                    <span className="font-medium">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'CAUTION' && (
              <div className="space-y-4">
                {cautions.map((caution, index) => (
                  <div key={index} className="flex justify-between border-b pb-4">
                    <span className="font-medium">{caution.icon}</span>
                    <span>{caution.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="mt-8  bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944]  text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
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