import React from 'react';
import { Project } from '../types';
import { format } from 'date-fns';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = project.completionRate || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-primary-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
          <span
            className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusColor(project.status)
            )}
          >
            {project.status.replace('_', ' ')}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{project.taskCount} tasks</span>
          </div>
          {project.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{format(new Date(project.dueDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          {project.completedTasksCount} of {project.taskCount} tasks completed
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;