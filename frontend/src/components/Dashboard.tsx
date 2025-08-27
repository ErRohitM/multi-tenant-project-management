import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../graphql/queries';
import { useOrganization } from '../contexts/OrganizationContext';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import ProjectStats from './ProjectStats';
import ProjectCard from './ProjectCard';
import CreateProjectForm from './CreateProjectForm';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOrganization } = useOrganization();
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationId: parseInt(selectedOrganization?.id || '0') },
    skip: !selectedOrganization,
  });

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleProjectCreated = () => {
    setShowCreateProject(false);
    refetch();
  };

  if (!selectedOrganization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Please select an organization to continue
        </h2>
        <p className="text-gray-600 mt-2">
          Use the dropdown in the header to select an organization.
        </p>
      </div>
    );
  }

  const projects = data?.projects || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedOrganization.name} Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your projects and track progress
          </p>
        </div>
        <button
          onClick={() => setShowCreateProject(true)}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      <ProjectStats />

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Projects</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first project.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateProject(true)}
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateProject && (
        <CreateProjectForm
          organizationId={parseInt(selectedOrganization.id)}
          onClose={() => setShowCreateProject(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;