import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS } from '../graphql/queries';
import { CREATE_TASK_COMMENT } from '../graphql/mutations';
import { TaskComment } from '../types';
import { format } from 'date-fns';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface TaskCommentsProps {
  taskId: number;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const [newComment, setNewComment] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  
  const { data, loading, refetch } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
  });

  const [createComment, { loading: createLoading }] = useMutation(CREATE_TASK_COMMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorEmail.trim()) return;

    try {
      await createComment({
        variables: {
          input: {
            taskId,
            content: newComment.trim(),
            authorEmail: authorEmail.trim(),
          },
        },
      });
      setNewComment('');
      refetch();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const comments: TaskComment[] = data?.taskComments || [];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h5 className="text-sm font-medium text-gray-900 mb-4">Comments</h5>
      
      <div className="space-y-3 mb-4">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {comment.authorEmail}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            placeholder="Your email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div className="flex space-x-2">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <button
            type="submit"
            disabled={createLoading || !newComment.trim() || !authorEmail.trim()}
            className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskComments;