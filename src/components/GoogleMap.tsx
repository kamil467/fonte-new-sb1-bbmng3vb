import React from 'react';

const GoogleMap = () => {
  return (
    <div className="w-full h-[400px] relative">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d902.2678517246349!2d55.33369385!3d25.2576583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5c6d6e2f4f4d%3A0xb5f9a8c4db6d550e!2sFONTE%20GENERAL%20TRADING%20LLC!5e0!3m2!1sen!2sae!4v1704622430283!5m2!1sen!2sae"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Fonte Showroom Location"
        className="absolute inset-0"
      />
    </div>
  );
};

export default GoogleMap;
