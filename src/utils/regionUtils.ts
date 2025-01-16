import { Region } from '../lib/supabase';

export type RegionCode = 'global-en' | 'uae-en' | 'omn-en' | 'ind-en';

export const getRegionIdFromCode = (code: RegionCode): number => {
  switch (code) {
    case 'global-en':
      return 1;
    case 'uae-en':
      return 2;
    case 'omn-en':
      return 3;
    case 'ind-en':
      return 4;
    default:
      return 1;
  }
};

export const getRegionCodeFromId = (id: number): RegionCode => {
  switch (id) {
    case 1:
      return 'global-en';
    case 2:
      return 'uae-en';
    case 3:
      return 'omn-en';
    case 4:
      return 'ind-en';
    default:
      return 'global-en';
  }
};

export const isValidRegionCode = (code: string): code is RegionCode => {
  return ['global-en', 'uae-en', 'omn-en', 'ind-en'].includes(code);
};

export const getRegionFromLocation = async (): Promise<RegionCode> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const country = data.country_name?.toLowerCase();

    if (country === 'united arab emirates') {
      return 'uae-en';
    } else if (country === 'oman') {
      return 'omn-en';
    } else if (country === 'india') {
      return 'ind-en';
    }
    return 'global-en';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'global-en';
  }
};

export const updateUrlWithRegion = (regionCode: RegionCode) => {
  const url = new URL(window.location.href);
  const pathParts = url.pathname.split('/');
  
  // Remove existing region code if present
  if (pathParts[1] && pathParts[1].endsWith('-en')) {
    pathParts.splice(1, 1);
  }
  
  // Add new region code
  pathParts.splice(1, 0, regionCode);
  
  const newPath = pathParts.join('/');
  window.history.replaceState({}, '', newPath);
};
