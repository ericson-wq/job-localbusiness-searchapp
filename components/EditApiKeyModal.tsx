'use client';

import { useState, useEffect } from 'react';
import { ApiKey } from '@/types/api-key';
import { updateApiKey, validateApiKey } from '@/lib/api-keys-storage';

interface EditApiKeyModalProps {
  apiKey: ApiKey | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onTestConnection?: (apiKey: string, host: string) => Promise<boolean>;
}

export default function EditApiKeyModal({
  apiKey,
  isOpen,
  onClose,
  onSave,
  onTestConnection,
}: EditApiKeyModalProps) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [creditsPerMonth, setCreditsPerMonth] = useState(0);
  const [rpmLimit, setRpmLimit] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (apiKey && isOpen) {
      setName(apiKey.name);
      setHost(apiKey.host);
      setApiKeyValue('');
      setCreditsPerMonth(apiKey.creditsPerMonth);
      setRpmLimit(apiKey.rpmLimit);
      setError('');
      setTestResult(null);
    }
  }, [apiKey, isOpen]);

  if (!isOpen || !apiKey) return null;

  const handleSave = () => {
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

    if (creditsPerMonth < 0) {
      setError('Credits per month must be a positive number');
      return;
    }

    // If API key is provided, validate it
    if (apiKeyValue.trim() && !validateApiKey(apiKeyValue)) {
      setError('Please enter a valid API key (minimum 20 characters)');
      return;
    }

    const updates: any = {
      name: name.trim(),
      host: host.trim(),
      creditsPerMonth,
      rpmLimit: rpmLimit || undefined,
    };

    // Only update API key if a new one was provided
    if (apiKeyValue.trim()) {
      updates.apiKey = apiKeyValue.trim();
    } else {
      // Empty string means keep current
      updates.apiKey = '';
    }

    const updated = updateApiKey(apiKey.id, updates);
    if (updated) {
      onSave();
      onClose();
    } else {
      setError('Failed to update API key. Please try again.');
    }
  };

  const handleTestConnection = async () => {
    if (!apiKeyValue.trim() && !apiKey.apiKey) {
      setError('Please enter an API key to test');
      return;
    }

    const keyToTest = apiKeyValue.trim() || apiKey.apiKey;
    setIsTesting(true);
    setError('');
    setTestResult(null);

    try {
      if (onTestConnection) {
        const success = await onTestConnection(keyToTest, host.trim() || apiKey.host);
        setTestResult({
          success,
          message: success
            ? 'Connection test successful!'
            : 'Connection test failed. Please check your API key and host.',
        });
      } else {
        // Simple validation test
        const isValid = validateApiKey(keyToTest);
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
          <h2 className="text-lg font-semibold text-gray-900text-white">Edit API Key</h2>
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
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {/* Host */}
          <div>
            <label htmlFor="edit-host" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              Host <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-host"
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g., jsearch.p.rapidapi.com"
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="edit-api-key" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-api-key"
              type="password"
              value={apiKeyValue}
              onChange={(e) => setApiKeyValue(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
            <p className="mt-1 text-xs text-gray-500text-gray-400">
              (leave blank to keep current)
            </p>
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
            <label htmlFor="edit-credits" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              Credits per Month <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-credits"
              type="number"
              min="0"
              value={creditsPerMonth}
              onChange={(e) => setCreditsPerMonth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white text-sm"
            />
          </div>

          {/* RPM Limit */}
          <div>
            <label htmlFor="edit-rpm" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
              RPM Limit
            </label>
            <input
              id="edit-rpm"
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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
