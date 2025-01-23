import React from 'react';

const About = () => {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-8">
            Fonte is known for its wide range of fabrics that includes Silk fabrics (Jacquard and Silk embroidery), Silk blends and Polyester/Cotton/Acrylic/Viscose blends.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Business Philosophy</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our business philosophy is to combine creativity and innovation with the highest levels of quality. We believe in quality of design, product and service combined with a committed and motivated team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Showroom"
              className="rounded-lg shadow-lg"
            />
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#B49A5E] mr-2">•</span>
                  <span>Premium quality materials and craftsmanship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#B49A5E] mr-2">•</span>
                  <span>Expert design consultation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#B49A5E] mr-2">•</span>
                  <span>Professional installation services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#B49A5E] mr-2">•</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;