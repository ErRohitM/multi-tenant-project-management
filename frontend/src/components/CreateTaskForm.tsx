import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '../graphql/mutations';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateTaskFormProps {
  projectId: number;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  projectId,
  onClose,
  onTaskCreated,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeEmail: '',
    dueDate: '',
  });

  const [createTask, { loading, error }] = useMutation(CREATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const input: any = {
        projectId,
        title: formData.title,
      };

      if (formData.description) input.description = formData.description;
      if (formData.assigneeEmail) input.assigneeEmail = formData.assigneeEmail;
      if (formData.dueDate) input.dueDate = new Date(formData.dueDate).toISOString();

      const result = await createTask({
        variables: { input },
      });

      if (result.data?.createTask?.success) {
        onTaskCreated();
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="assigneeEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee Email
            </label>
            <input
              type="email"
              id="assigneeEmail"
              name="assigneeEmail"
              value={formData.assigneeEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              Error creating task. Please try again.
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;