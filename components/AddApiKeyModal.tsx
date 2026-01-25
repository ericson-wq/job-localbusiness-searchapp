'use client';

import { useState } from 'react';
import { addApiKey, validateApiKey } from '@/lib/api-keys-storage';

interface AddApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  onTestConnection?: (apiKey: string, host: string) => Promise<boolean>;
}

export default function AddApiKeyModal({ isOpen, onClose, onAdd, onTestConnection }: AddApiKeyModalProps) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
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

    if (!host.trim()) {
      setError('Host is required');
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
      host: host.trim(),
      apiKey: apiKeyValue.trim(),
      creditsPerMonth,
      rpmLimit: rpmLimit || undefined,
      isActive: true,
    });

    if (newKey) {
      // Reset form
      setName('');
      setHost('');
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
        const success = await onTestConnection(apiKeyValue.trim(), host.trim() || 'jsearch.p.rapidapi.com');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-whitebg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900text-white">Add API Key</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600hover:text-gray-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="add-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 50k Creds"
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {/* Host */}
          <div>
            <label htmlFor="add-host" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              Host <span className="text-red-500">*</span>
            </label>
            <input
              id="add-host"
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g., jsearch.p.rapidapi.com"
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="add-api-key" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              id="add-api-key"
              type="password"
              value={apiKeyValue}
              onChange={(e) => setApiKeyValue(e.target.value)}
              placeholder="Enter your RapidAPI key"
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
            {onTestConnection && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="mt-2 px-3 py-1.5 bg-gray-200bg-gray-700 text-gray-700text-gray-300 rounded-md hover:bg-gray-300hover:bg-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
            )}
            {testResult && (
              <div
                className={`mt-2 p-2 rounded-md text-xs ${
                  testResult.success
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-red-50bg-red-900/20 text-red-800text-red-200'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>

          {/* Credits per Month */}
          <div>
            <label htmlFor="add-credits" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              Credits per Month <span className="text-red-500">*</span>
            </label>
            <input
              id="add-credits"
              type="number"
              min="0"
              value={creditsPerMonth}
              onChange={(e) => setCreditsPerMonth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {/* RPM Limit */}
          <div>
            <label htmlFor="add-rpm" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              RPM Limit
            </label>
            <input
              id="add-rpm"
              type="number"
              min="1"
              value={rpmLimit || ''}
              onChange={(e) => setRpmLimit(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-50bg-red-900/20 border border-red-200border-red-800 rounded-md">
              <p className="text-xs text-red-800text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-whitebg-gray-700 text-gray-700text-gray-300 border border-gray-300border-gray-600 rounded-md hover:bg-gray-50hover:bg-gray-600 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium shadow-sm"
          >
            Add API Key
          </button>
        </div>
      </div>
    </div>
  );
}
