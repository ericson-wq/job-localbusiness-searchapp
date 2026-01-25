'use client';

import { useState, useEffect } from 'react';
import { saveApiKey, getApiKey, clearApiKey, hasApiKey, validateApiKey } from '@/lib/api-key-storage';

interface ApiKeyInputProps {
  onApiKeyChange?: (hasKey: boolean) => void;
}

export default function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if API key exists on mount
    const existingKey = getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setIsSaved(true);
      onApiKeyChange?.(true);
    } else {
      onApiKeyChange?.(false);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    setError('');
    setSuccess('');

    if (!validateApiKey(apiKey)) {
      setError('Please enter a valid API key (minimum 20 characters)');
      return;
    }

    if (saveApiKey(apiKey)) {
      setIsSaved(true);
      setSuccess('API key saved successfully!');
      onApiKeyChange?.(true);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to save API key. Please try again.');
    }
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setIsSaved(false);
    setError('');
    setSuccess('');
    onApiKeyChange?.(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setIsSaved(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="w-full bg-whitebg-gray-800 border border-gray-200border-gray-700 rounded-lg shadow-sm mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900text-white">
              RapidAPI Key Configuration
            </h2>
            {hasApiKey() && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connected
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700text-gray-400hover:text-gray-200"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {!isCollapsed && (
          <div className="space-y-3">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700text-gray-300 mb-1">
                RapidAPI Key
              </label>
              <div className="relative">
                <input
                  id="api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={handleInputChange}
                  placeholder="Enter your RapidAPI key"
                  className="w-full px-4 py-2 pr-10 border border-gray-300border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500bg-gray-700text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700text-gray-400hover:text-gray-200"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29M3 3l13.42 13.42" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500text-gray-400">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50bg-red-900/20 border border-red-200border-red-800 rounded-md">
                <p className="text-sm text-red-800text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">{success}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaved ? 'Update API Key' : 'Save API Key'}
              </button>
              {hasApiKey() && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Clear API Key
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
