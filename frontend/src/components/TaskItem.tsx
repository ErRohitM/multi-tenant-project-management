import React, { useState } from 'react';
import { Task } from '../types';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK } from '../graphql/mutations';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import TaskComments from './TaskComments';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [updateTask, { loading }] = useMutation(UPDATE_TASK);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask({
        variables: {
          input: {
            id: parseInt(task.id),
            status: newStatus,
          },
        },
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <PlayIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
  ];

  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(task.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {task.title}
              </h4>
              <div className="flex items-center space-x-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={loading}
                  className={clsx(
                    'text-xs font-medium px-2.5 py-0.5 rounded-full border-none focus:ring-2 focus:ring-primary-500',
                    getStatusColor(task.status)
                  )}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            )}

            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {task.assigneeEmail && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{task.assigneeEmail}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                </div>
              )}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center hover:text-gray-700 transition-colors"
              >
                <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                <span>Comments</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pl-8">
          <TaskComments taskId={parseInt(task.id)} />
        </div>
      )}
    </div>
  );
};

export default TaskItem;