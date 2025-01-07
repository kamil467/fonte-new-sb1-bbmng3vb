import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMap from '../components/GoogleMap';

const Home = () => {
  return (
    <div>
      <div className="relative h-[80vh]">
        <img 
          src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Luxury Furnishing Solutions</h1>
            <p className="text-xl mb-8">Elevate Your Space with Premium Fabrics & Design</p>
            <Link 
              to="/products" 
              className="bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944] transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>

      <section className="py-16 bg-[#EDD8AF] bg-opacity-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((collection, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={collection.image} alt={collection.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{collection.title}</h3>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <Link 
                    to={collection.link} 
                    className="text-[#B49A5E] hover:text-[#776944]"
                  >
                    View Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-[#B49A5E] rounded-full flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Interior Design" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <GoogleMap />
    </div>
  );
}

const featuredCollections = [
  {
    title: "Premium Curtains",
    description: "Elegant curtains crafted from the finest fabrics",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/products"
  },
  {
    title: "Luxury Upholstery",
    description: "Transform your furniture with premium materials",
    image: "https://images.unsplash.com/photo-1540638349517-3abd5afc9847?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/products"
  },
  {
    title: "Designer Collections",
    description: "Exclusive designs for discerning tastes",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    link: "/products"
  }
];

const features = [
  {
    title: "Premium Quality",
    description: "Only the finest materials and craftsmanship",
    icon: "🌟"
  },
  {
    title: "Custom Solutions",
    description: "Tailored to your specific requirements",
    icon: "✨"
  },
  {
    title: "Expert Installation",
    description: "Professional installation services",
    icon: "🛠️"
  },
  {
    title: "Lifetime Support",
    description: "Dedicated after-sales service",
    icon: "💫"
  }
];

export default Home;