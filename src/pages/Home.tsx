import GoogleMap from '../components/GoogleMap';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialSlide(curr => (curr === testimonials.length - 3 ? 0 : curr + 1));
    }, 3000); // Change testimonial every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const regionCode = location.pathname.split('/')[1];
  const uaeMap = "https://maps.google.com/maps?q=FONTE%20GENERAL%20TRADING%20LLC&t=m&z=10&output=embed&iwloc=near";
  const omanMap = "https://maps.google.com/maps?q=BLUE%20BIRD%20TRAVELS%20-%20SEEB&t=m&z=8&output=embed&iwloc=near";
  const indiaMap= "https://maps.google.com/maps?q=Robodigx&t=m&z=8&output=embed&iwloc=near";

 console.log(regionCode);
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
          {/*}  <Link 
              to={`/${regionCode}/products`} 
              className="inline-block bg-[#B49A5E] text-white px-8 py-3 rounded hover:bg-[#776944] transition-colors opacity-0"
              style={{
                animation: 'fadeInUp 1s ease-out 0.9s forwards',
                opacity: 0,
              }}
            >
              Explore Collections
            </Link>
            */}
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
                 {/* 
                  <Link 
                    to={collection.link}
                    className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-[#776944] transition-colors"
                  >
                    About Us →
                  </Link>
                  */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Grid Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16 flex-col md:flex-row gap-4">
            <h2 className="text-4xl md:text-6xl font-bold max-w-2xl text-center md:text-left">
              Explore Our Proudly Collection
            </h2>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-[#776944] transition-colors"
            >
              View More
              <span className="w-6 h-6 flex items-center justify-center border border-white rounded-full">→</span>
            </Link>
          </div>
          
          <p className="text-gray-600 text-lg mb-12 text-center md:text-right max-w-xl md:ml-auto">
            Fonte will showcase its vision of contemporary architecture, interior design trends, and innovative living at Dubai Design Week 2024.
          </p>

          {/* Mobile Carousel */}
          <div className="relative md:hidden">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {additionalCollections.map((collection, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="relative h-[400px] rounded-2xl overflow-hidden">
                      <img 
                        src={collection.image} 
                        alt={collection.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                          <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                       {/* <p className="text-sm opacity-80">{collection.description}</p> */}  
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button 
              onClick={() => setCurrentSlide(curr => Math.max(0, curr - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentSlide(curr => Math.min(additionalCollections.length - 1, curr + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              disabled={currentSlide === additionalCollections.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-12 gap-6">
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

      {/* Testimonials Section */}
      <section className="py-16 bg-[#f7f6f6]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600">Discover why clients choose Fonte for their luxury furnishing needs</p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialSlide * (100 / 3)}%)` }}
              >
                {/* Duplicate testimonials for infinite loop effect */}
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="w-1/3 flex-shrink-0 px-2 md:px-4"
                    style={{ transition: 'opacity 0.3s ease-in-out' }}
                  >
                    <div className="bg-white p-3 md:p-6 rounded-lg shadow-md h-full">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover mr-2 md:mr-4"
                        />
                        <div>
                          <h3 className="font-semibold text-sm md:text-lg">{testimonial.name}</h3>
                          <p className="text-gray-600 text-xs md:text-sm">{testimonial.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4 text-sm md:text-base">"{testimonial.testimonial}"</p>
                      <div className="flex text-[#B49A5E]">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 md:w-5 md:h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.slice(0, testimonials.length - 2).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentTestimonialSlide === index ? 'bg-[#B49A5E]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial group ${index + 1}`}
                />
              ))}
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

      {regionCode === 'uae-en' && <GoogleMap mapUrl={uaeMap} />}
      {regionCode === 'omn-en' && <GoogleMap mapUrl={omanMap} />}
      {regionCode === 'ind-en' && <GoogleMap mapUrl={indiaMap} />}
      {regionCode === 'global-en' && (
        <div className="mt-12">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-x-auto">
            {/* Dubai Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">UAE Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=FONTE%20GENERAL%20TRADING%20LLC&t=m&z=10&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonte Dubai Location"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Oman Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">Oman Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=BLUE%20BIRD%20TRAVELS%20-%20SEEB&t=m&z=8&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonte Oman Location"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* India Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#B49A5E]">India Office</h3>
              <div className="h-[300px] w-full">
                <iframe
                  src="https://maps.google.com/maps?q=Robodigx&t=m&z=8&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonte India Location"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

const additionalCollections = [
  {
    title: "Mondrian",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_1.jpeg?updatedAt=1736275811539",
   
  },
  {
    title: "Nirnia",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_2.jpeg?updatedAt=1736275811553",
    
  },
  {
    title: "Artex",
 
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_3.jpeg?updatedAt=1736275811539",
   
  },
  {
    title: "Fonte",
    image: "https://ik.imagekit.io/kamil467/Fonte/curtain_4.jpeg?updatedAt=1736278429450",
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Dubai, UAE",
    image: "https://ik.imagekit.io/kamil467/Fonte/testimonial_1.jpeg?updatedAt=1736279445015",
    testimonial: "Fonte transformed our home with their exquisite collection of curtains and furnishings. Their attention to detail and commitment to quality is unmatched."
  },
  {
    name: "Ahmed Al-Sayed",
    location: "Muscat, Oman",
    image: "https://ik.imagekit.io/kamil467/Fonte/testimonial_2.jpeg?updatedAt=1736279445015",
    testimonial: "Working with Fonte was a pleasure from start to finish. Their team's expertise and professionalism made the entire process seamless."
  },
  {
    name: "Priya Patel",
    location: "Kerala, India",
    image: "https://ik.imagekit.io/kamil467/Fonte/testimonial_3.jpeg?updatedAt=1736279445015",
    testimonial: "The quality of Fonte's products exceeded our expectations. Their designs have added a touch of elegance to our space that we absolutely love."
  },
  {
    name: "Kiran John",
    location: "Kerala, India",
    image: "https://ik.imagekit.io/kamil467/Fonte/testimonial_3.jpeg?updatedAt=1736279445015",
    testimonial: "The quality of Fonte's products exceeded our expectations. Their designs have added a touch of elegance to our space that we absolutely love."
  }
];

export default Home;