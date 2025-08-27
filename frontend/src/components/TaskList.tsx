import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onTaskUpdate }) => {
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  const getFilterCount = (status: string) => {
    if (status === 'ALL') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {[
            { key: 'ALL', label: 'All Tasks' },
            { key: 'TODO', label: 'To Do' },
            { key: 'IN_PROGRESS', label: 'In Progress' },
            { key: 'DONE', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`${
                filter === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
            >
              {tab.label}
              <span className={`${
                filter === tab.key ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
              } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                {getFilterCount(tab.key)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'ALL' ? 'Get started by creating a new task.' : `No ${filter.toLowerCase().replace('_', ' ')} tasks found.`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={onTaskUpdate} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;