// src/context/regionContext.ts
import React, { createContext, useEffect, useState } from 'react';
import { fetchRegions } from '../services/regionService';
import { Region } from '../lib/supabase';

interface RegionContextType {
    regions: Region[];
    loading: boolean;
    error: string | null;
}   
export const RegionContext = createContext<RegionContextType | undefined>(undefined);




export const RegionProvider: React.FC = ({ children }) => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRegions = async () => {
            try {
                const data = await fetchRegions();
                setRegions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        loadRegions();
    }, []);

    return (
        <RegionContext.Provider value={{ regions, loading, error }}>
            {children}
        </RegionContext.Provider>
    );
};