'use client';

import { deleteApiKey } from '@/lib/api-keys-storage';
import { ApiKey } from '@/types/api-key';

interface DeleteApiKeyModalProps {
  apiKey: ApiKey | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteApiKeyModal({ apiKey, isOpen, onClose, onDelete }: DeleteApiKeyModalProps) {
  if (!isOpen || !apiKey) return null;

  const handleDelete = () => {
    if (deleteApiKey(apiKey.id)) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Delete API Key '{apiKey.name}'?
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-700">
            This will remove the account from the API pool. Any in-progress things may fail or any in-progress search
            may fail.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
