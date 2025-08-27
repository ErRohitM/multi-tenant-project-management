import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '../graphql/mutations';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateProjectFormProps {
  organizationId: number;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  organizationId,
  onClose,
  onProjectCreated,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
  });

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const input: any = {
        organizationId,
        name: formData.name,
      };

      if (formData.description) input.description = formData.description;
      if (formData.dueDate) input.dueDate = formData.dueDate;

      const result = await createProject({
        variables: { input },
      });

      if (result.data?.createProject?.success) {
        onProjectCreated();
      }
    } catch (err) {
      console.error('Error creating project:', err);
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
          <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              Error creating project. Please try again.
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
              disabled={loading || !formData.name.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;