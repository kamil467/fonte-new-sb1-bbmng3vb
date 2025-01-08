import GoogleMap from '../components/GoogleMap';
import React from 'react';
import { Link } from 'react-router-dom';

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
          <div className="text-center text-white space-y-6">
            <h1 
              className="text-5xl font-bold mb-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]"
              style={{
                animation: 'fadeInUp 1s ease-out 0.3s forwards',
                opacity: 0,
              }}
            >
              Luxury Furnishing Solutions
            </h1>
            <p 
              className="text-xl mb-8 opacity-0"
              style={{
                animation: 'fadeInUp 1s ease-out 0.6s forwards',
                opacity: 0,
              }}
            >
              Elevate Your Space with Premium Fabrics & Design
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944] transition-colors opacity-0"
              style={{
                animation: 'fadeInUp 1s ease-out 0.9s forwards',
                opacity: 0,
              }}
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>

      <section className="py-16 bg-[#B49A5E] bg-opacity-5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#776944]">Find the best Fabrics for Curtains & Upholstery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {featuredCollections.map((collection, index) => (
              <Link key={index} to={collection.link} className="group block relative">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={collection.image} 
                    alt={collection.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-20 pb-8 px-8">
                    <h3 className="text-3xl font-semibold mb-3 text-white">{collection.title}</h3>
                    <p className="text-white/90 text-lg leading-relaxed">{collection.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#B49A5E] bg-opacity-10">
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

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const featuredCollections = [
  {
    title: "Curtains",
    description: "Treat your sunny room and windows with elegant and beautifully finished look draperies. Available in many widths & lengths.",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg?updatedAt=1736278429450",
    link: "/products"
  },
  {
    title: "Upholstery",
    description: "A delightful collection of upholsteries that brings with it a fresh burst of colours and classic grandeur.",
    image: "https://ik.imagekit.io/kamil467/Fonte/bedsheet_2.jpeg?updatedAt=1736275811337",
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