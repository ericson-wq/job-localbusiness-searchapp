'use client';

import { useState } from 'react';
import { addApiKey, validateApiKey } from '@/lib/api-keys-storage';

interface AddApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  onTestConnection?: (apiKey: string, host?: string) => Promise<boolean>;
}

const DEFAULT_HOST = 'jsearch.p.rapidapi.com';

export default function AddApiKeyModal({ isOpen, onClose, onAdd, onTestConnection }: AddApiKeyModalProps) {
  const [name, setName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [creditsPerMonth, setCreditsPerMonth] = useState(10000);
  const [rpmLimit, setRpmLimit] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleAdd = () => {
    setError('');
    setTestResult(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!apiKeyValue.trim()) {
      setError('API Key is required');
      return;
    }

    if (!validateApiKey(apiKeyValue)) {
      setError('Please enter a valid API key (minimum 20 characters)');
      return;
    }

    if (creditsPerMonth < 0) {
      setError('Credits per month must be a positive number');
      return;
    }

    const newKey = addApiKey({
      name: name.trim(),
      host: DEFAULT_HOST,
      apiKey: apiKeyValue.trim(),
      creditsPerMonth,
      rpmLimit: rpmLimit || undefined,
      isActive: true,
    });

    if (newKey) {
      // Reset form
      setName('');
      setApiKeyValue('');
      setCreditsPerMonth(10000);
      setRpmLimit(undefined);
      onAdd();
      onClose();
    } else {
      setError('Failed to add API key. Please try again.');
    }
  };

  const handleTestConnection = async () => {
    if (!apiKeyValue.trim()) {
      setError('Please enter an API key to test');
      return;
    }

    setIsTesting(true);
    setError('');
    setTestResult(null);

    try {
      if (onTestConnection) {
        const success = await onTestConnection(apiKeyValue.trim(), DEFAULT_HOST);
        setTestResult({
          success,
          message: success
            ? 'Connection test successful!'
            : 'Connection test failed. Please check your API key and host.',
        });
      } else {
        // Simple validation test
        const isValid = validateApiKey(apiKeyValue.trim());
        setTestResult({
          success: isValid,
          message: isValid
            ? 'API key format is valid.'
            : 'API key format is invalid.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Connection test failed. Please try again.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">Add API Key</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-white">
          {/* Name */}
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="add-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 50k Creds"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="add-api-key" className="block text-sm font-medium text-gray-700 mb-2">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              id="add-api-key"
              type="password"
              value={apiKeyValue}
              onChange={(e) => setApiKeyValue(e.target.value)}
              placeholder="Enter your RapidAPI key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
            />
            {onTestConnection && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="mt-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            )}
            {testResult && (
              <div
                className={`mt-2 p-2 rounded-md text-xs ${
                  testResult.success
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>

          {/* Credits per Month */}
          <div>
            <label htmlFor="add-credits" className="block text-sm font-medium text-gray-700 mb-2">
              Credits per Month <span className="text-red-500">*</span>
            </label>
            <input
              id="add-credits"
              type="number"
              min="0"
              value={creditsPerMonth}
              onChange={(e) => setCreditsPerMonth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
            />
          </div>

          {/* RPM Limit */}
          <div>
            <label htmlFor="add-rpm" className="block text-sm font-medium text-gray-700 mb-2">
              RPM Limit
            </label>
            <input
              id="add-rpm"
              type="number"
              min="1"
              value={rpmLimit || ''}
              onChange={(e) => setRpmLimit(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium shadow-sm transition-colors"
          >
            Add API Key
          </button>
        </div>
      </div>
    </div>
  );
}
