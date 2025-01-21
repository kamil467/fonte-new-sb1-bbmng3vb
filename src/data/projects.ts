import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 1,
    title: 'Luxury Villa Interior Design',
    description: 'Contemporary interior design for a luxury villa featuring custom furniture and premium finishes.',
    location: 'Palm Jumeirah, Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    category: 'Residential',
    regionId: 2, // UAE
    completionDate: '2024',
    area: '15,000 sq ft'
  },
  {
    id: 2,
    title: 'Modern Office Complex',
    description: 'Complete office interior solution with ergonomic furniture and collaborative spaces.',
    location: 'Business Bay, Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    category: 'Commercial',
    regionId: 2, // UAE
    completionDate: '2023',
    area: '25,000 sq ft'
  },
  {
    id: 3,
    title: 'Boutique Hotel Renovation',
    description: 'Full-scale renovation of a boutique hotel including custom furniture and lighting solutions.',
    location: 'Muscat, Oman',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    category: 'Hospitality',
    regionId: 3, // Oman
    completionDate: '2024',
    area: '30,000 sq ft'
  },
  {
    id: 4,
    title: 'Corporate Headquarters',
    description: 'Modern corporate office design with sustainable materials and smart furniture solutions.',
    location: 'Mumbai, India',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    category: 'Commercial',
    regionId: 4, // India
    completionDate: '2023',
    area: '40,000 sq ft'
  }
];
