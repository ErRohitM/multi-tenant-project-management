import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_TASKS } from '../graphql/queries';
import { useOrganization } from '../contexts/OrganizationContext';
import { Project } from '../types';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import clsx from 'clsx';

const ProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { selectedOrganization } = useOrganization();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { organizationId: parseInt(selectedOrganization?.id || '0') },
    skip: !selectedOrganization,
    onCompleted: (data) => {
      if (!selectedProject && projectId) {
        const project = data.projects.find((p: Project) => p.id === projectId);
        if (project) setSelectedProject(project);
      }
    },
  });

  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useQuery(GET_TASKS, {
    variables: { projectId: parseInt(projectId || '0') },
    skip: !projectId,
  });

  const handleProjectChange = (project: Project) => {
    setSelectedProject(project);
    navigate(`/project/${project.id}`);
  };

  const handleTaskCreated = () => {
    setShowCreateTask(false);
    refetchTasks();
  };

  if (!selectedOrganization) {
    return <div>Please select an organization first.</div>;
  }

  const projects = projectsData?.projects || [];
  const tasks = tasksData?.tasks || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center items-center rounded-md bg-white px-4 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                  {selectedProject?.name || 'Select Project'}
                  <svg className="-mr-1 ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-80 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {projects.map((project: Project) => (
                      <Menu.Item key={project.id}>
                        {({ active }) => (
                          <button
                            onClick={() => handleProjectChange(project)}
                            className={clsx(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              selectedProject?.id === project.id ? 'bg-primary-50 text-primary-700' : '',
                              'block w-full px-4 py-2 text-left text-sm'
                            )}
                          >
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-xs text-gray-500">{project.status} • {project.taskCount} tasks</div>
                            </div>
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <button
          onClick={() => setShowCreateTask(true)}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      {selectedProject && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedProject.name}</h2>
              <p className="text-gray-600 mt-1">{selectedProject.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(selectedProject.completionRate)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${selectedProject.completionRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
        </div>
        <TaskList tasks={tasks} loading={tasksLoading} onTaskUpdate={refetchTasks} />
      </div>

      {showCreateTask && selectedProject && (
        <CreateTaskForm
          projectId={parseInt(selectedProject.id)}
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default ProjectView;