import { Region } from "../lib/supabase";

// src/services/regionService.ts
const API_URL = 'http://localhost:1337/api'; // Replace with your API URL

export const fetchRegions = async (): Promise<Region[]> => {
    const response = await fetch(`${API_URL}/regions`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer bcb80324924b4516362890841b90810cd21a32ff6830c4d029df40b8730806d91903ea62fb36fa1990cf71440851e5b7d0e6d67a48d8adbacc01b47ca990c2759b2778e63ff778d91e3e35a7fae2336cb123547c9ca8e361c223f9c97c26c92ab9eb080f632423f22d7be026045fc45dff385c280807a54073efe21a36029d71`, // Include the API key here
            'Content-Type': 'application/json', // Optional: Set content type
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch regions');
    }
    return response.json();
};

// Add other methods like createRegion, updateRegion, deleteRegion as needed