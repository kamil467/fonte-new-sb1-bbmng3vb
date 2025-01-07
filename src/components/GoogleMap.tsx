import React from 'react';

const GoogleMap = () => {
  return (
    <div className="w-full h-[400px] relative">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1804.3787633310155!2d55.30703873355741!3d25.24509059016152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f439940578155%3A0x9755b6b615831e7f!2sFONTE%20GENERAL%20TRADING%20LLC!5e0!3m2!1sen!2snl!4v1736245183166!5m2!1sen!2snl"
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
