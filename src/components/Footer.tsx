import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FacebookIcon, Instagram, Mail, MapPin, Phone, Globe } from 'lucide-react';
import { supabase, Region } from '../lib/supabase';
import { isValidRegionCode, getRegionIdFromCode } from '../utils/regionUtils';

const Footer = () => {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchRegionData();
  }, [location.pathname]);

  const fetchRegionData = async () => {
    try {
      const pathParts = location.pathname.split('/');
      const urlRegionCode = pathParts[1];

      if (urlRegionCode && isValidRegionCode(urlRegionCode)) {
        const regionId = getRegionIdFromCode(urlRegionCode);
        const { data: regionData, error } = await supabase
          .from('regions')
          .select('*')
          .eq('id', regionId)
          .single();

        if (error) throw error;
        setCurrentRegion(regionData);
      }
    } catch (error) {
      console.error('Error fetching region data:', error);
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Description */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <img 
              src="https://ik.imagekit.io/kamil467/fonte_logo-removebg.png?updatedAt=1736246322296" 
              alt="Fonte" 
              className="h-12 mb-2"
            />
            <div className="text-gray-400 text-sm">
              <p>Luxury furnishing solutions for discerning clients</p>
              <div className="mt-4">
                {currentRegion?.email_1 && (
                  <div className="flex items-center">
                    <Mail size={14} className="mr-1 text-[#B49A5E]" />
                    <a className="text-gray-400" href={`mailto:${currentRegion.email_1}`}>{currentRegion.email_1}</a>
                  </div>
                )}
                {currentRegion?.email_2 && (
                  <div className="flex items-center">
                    <Mail size={14} className="mr-1 text-[#B49A5E]" />
                    <a className="text-gray-400" href={`mailto:${currentRegion.email_2}`}>{currentRegion.email_2}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Region Icon and Name */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
            {currentRegion && (
              <div className="flex items-center mt-4">
                <img src={currentRegion.icon_url} alt={currentRegion.name} className="w-8 h-8 mr-2" />
                <span className="text-lg font-semibold text-[#B49A5E]">{currentRegion.name}</span>
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-[#B49A5E] hover:text-[#fff]">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-400 hover:text-[#B49A5E] text-sm">Home</Link></li>
              <li><Link to="/Gallery" className="text-gray-400 hover:text-[#B49A5E] text-sm">Gallery</Link></li>
              <li><Link to= {`/${currentRegion?.code}/expertise`} className="text-gray-400 hover:text-[#B49A5E] text-sm">Expertise</Link></li>
              <li><Link to={`/${currentRegion?.code}/about`} className="text-gray-400 hover:text-[#B49A5E] text-sm">About Us</Link></li>
              <li><Link to={`/${currentRegion?.code}/contact`} className="text-gray-400 hover:text-[#B49A5E] text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Region Location */}
          <div className="lg:col-span-3">
            {currentRegion && (
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-[#B49A5E] mt-1 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p className="font-semibold text-[#B49A5E]">{currentRegion.name}</p>
                  <p>{currentRegion.address_1}</p>
                  {currentRegion.address_2 && <p>{currentRegion.address_2}</p>}
                  {currentRegion.city && <p>{currentRegion.city}</p>}
                  {currentRegion.country && <p>{currentRegion.country}</p>}
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="lg:col-span-3">
            {currentRegion && (
              <div className="space-y-2 text-sm text-gray-400">
                {currentRegion.contact_no_1 && (
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#B49A5E]" />
                    <a href={`tel:${currentRegion.contact_no_1}`} className="hover:text-[#B49A5E]">{currentRegion.contact_no_1}</a>
                  </div>
                )}
                {currentRegion.contact_no_2 && (
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#B49A5E]" />
                    <a href={`tel:${currentRegion.contact_no_2}`} className="hover:text-[#B49A5E]">{currentRegion.contact_no_2}</a>
                  </div>
                )}
                {currentRegion.whatsapp_no && (
                  <div className="flex items-center">
                    <Phone size={14} className="mr-1 text-[#B49A5E]" />
                    <a href={`https://wa.me/${currentRegion.whatsapp_no}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#B49A5E]">WhatsApp: {currentRegion.whatsapp_no}</a>
                  </div>
                )}
                {currentRegion.map_url && (
                  <div className="flex items-center">
                    <Globe size={14} className="mr-1 text-[#B49A5E]" />
                    <a href={currentRegion.map_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#B49A5E]">View on Map</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-gray-800">
        <a href="https://www.facebook.com/fonteid" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B49A5E]">
          <FacebookIcon size={20} />
        </a>
        <a href="https://www.instagram.com/fonte_i.d" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B49A5E]">
          <Instagram size={20} />
        </a>
        <a href="mailto:info@fonteid.com" className="text-gray-400 hover:text-[#B49A5E]">
          <Mail size={20} />
        </a>
        <a href="https://www.fonteid.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B49A5E]">
          <Globe size={20} />
        </a>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Fonte General Trading LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
