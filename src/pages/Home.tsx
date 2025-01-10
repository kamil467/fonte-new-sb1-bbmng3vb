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
          <div className="space-y-16">
            {featuredCollections.map((collection, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                <div className="w-full md:w-1/2">
                  <img 
                    src={collection.image} 
                    alt={collection.title} 
                    className="w-full h-[500px] object-cover rounded-lg"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="text-sm uppercase tracking-wider text-[#B49A5E]">Elegance • Timeless</div>
                  <h3 className="text-5xl font-bold text-[#776944]">{collection.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{collection.description}</p>
                  <Link 
                    to={collection.link}
                    className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-[#776944] transition-colors"
                  >
                    About Us →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Collection Grid Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-6xl font-bold max-w-2xl">Explore Our Proudly Collection</h2>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-[#776944] transition-colors"
            >
              View More
              <span className="w-6 h-6 flex items-center justify-center border border-white rounded-full">→</span>
            </Link>
          </div>
          
          <p className="text-gray-600 text-lg mb-12 text-right max-w-xl ml-auto">
            Fonte will showcase its vision of contemporary architecture, interior design trends, and innovative living at Dubai Design Week 2024.
          </p>

          <div className="grid grid-cols-12 gap-6">
            {/* Mondrian - Large */}
            <div className="col-span-12 md:col-span-4 relative group">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://ik.imagekit.io/kamil467/Fonte/curtain_1.jpeg?updatedAt=1736275811539" 
                  alt="Mondrian Collection" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-3xl font-bold text-white">Mondrian</h3>
                   
                  </div>
                </div>
              </div>
            </div>

            {/* Nirnia - Extra Large */}
            <div className="col-span-12 md:col-span-8 relative group">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://ik.imagekit.io/kamil467/Fonte/curtain_2.jpeg?updatedAt=1736275811553" 
                  alt="Nirnia Collection" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-3xl font-bold text-white">Nirnia</h3>

                  </div>
                </div>
              </div>
            </div>

            {/* Artex */}
            <div className="col-span-12 md:col-span-8 relative group">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://ik.imagekit.io/kamil467/Fonte/curtain_3.jpeg?updatedAt=1736275811539" 
                  alt="Artex Collection" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-3xl font-bold text-white">Artex</h3>

                  </div>
                </div>
              </div>
            </div>

            {/* Additional Collections */}
            <div className="col-span-12 md:col-span-4 relative group">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img 
                  src="https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg?updatedAt=1736278429450" 
                  alt="Additional Collection" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-3xl font-bold text-white">Fonte</h3>

                  </div>
                </div>
              </div>
            </div>
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
    title: "Modern Style\nTimeless Charm",
    description: "Discover our premium curtain collection, featuring elegant draperies that transform your windows with sophistication. Available in diverse styles, patterns, and lengths to perfectly complement your space.",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg?updatedAt=1736278429450",
    link: "/products"
  },
  {
    title: "Classic Design\nModern Comfort",
    description: "Experience our exquisite upholstery collection that brings together timeless elegance and contemporary comfort. Each piece is crafted to add a touch of luxury to your living space.",
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