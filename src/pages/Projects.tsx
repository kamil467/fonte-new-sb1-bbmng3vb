import React from 'react';
import { useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import { getRegionIdFromCode, RegionCode } from '../utils/regionUtils';

const Projects: React.FC = () => {
  const { region } = useParams<{ region: RegionCode }>();
  const regionId = getRegionIdFromCode(region as RegionCode);
  
  // Filter projects by region
  const regionProjects = projects.filter(project => project.regionId === regionId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regionProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Location:</span>
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Category:</span>
                  {project.category}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Area:</span>
                  {project.area}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Completed:</span>
                  {project.completionDate}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {regionProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No projects found in this region.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
