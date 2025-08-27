import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_STATS } from '../graphql/queries';
import { useOrganization } from '../contexts/OrganizationContext';
import { ChartBarIcon, ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ProjectStats: React.FC = () => {
  const { selectedOrganization } = useOrganization();
  const { data, loading, error } = useQuery(GET_PROJECT_STATS, {
    variables: { organizationId: parseInt(selectedOrganization?.id || '0') },
    skip: !selectedOrganization,
  });

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>;
  if (error || !data) return null;

  const stats = data.projectStats;

  const statItems = [
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Active Projects',
      value: stats.activeProjects,
      icon: ClockIcon,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      name: 'Completed Projects',
      value: stats.completedProjects,
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: 'Overall Completion',
      value: `${Math.round(stats.overallCompletionRate)}%`,
      icon: ChartBarIcon,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => (
        <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${item.color}`}>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStats;