import React from 'react';

const Expertise = () => {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Expertise</h1>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-12 text-center">
            At Fonte, we work with leading interior designers, architects, and specifiers to create outstanding contract interiors, with showrooms and dedicated contract service teams to produce specific requirements and special orders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Craftsmanship"
              className="rounded-lg shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-6">Custom Manufacturing</h2>
              <p className="text-gray-700 mb-4">
                Our manufacturing facility specializes in customizing designs as per customers' requirements for a minimum quantity.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B49A5E] rounded-full mr-3"></span>
                  <span>Residential Projects</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B49A5E] rounded-full mr-3"></span>
                  <span>Commercial Spaces</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B49A5E] rounded-full mr-3"></span>
                  <span>Hospitality Sector</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#B49A5E] rounded-full mr-3"></span>
                  <span>Luxury Yachts</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-[#EDD8AF] rounded-full flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const services = [
  {
    title: "Custom Design",
    description: "Tailored solutions to match your specific requirements and style preferences.",
    icon: "✨"
  },
  {
    title: "Installation",
    description: "Professional installation services ensuring perfect fit and finish.",
    icon: "🛠️"
  },
  {
    title: "Consultation",
    description: "Expert advice on fabric selection, design, and maintenance.",
    icon: "💡"
  }
];

export default Expertise;