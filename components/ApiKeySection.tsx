'use client';

import { useState, useEffect } from 'react';
import {
  getAllApiKeys,
  updateApiKey,
  migrateOldApiKey,
} from '@/lib/api-keys-storage';
import { ApiKey } from '@/types/api-key';
import AddApiKeyModal from './AddApiKeyModal';
import EditApiKeyModal from './EditApiKeyModal';
import DeleteApiKeyModal from './DeleteApiKeyModal';

interface ApiKeySectionProps {
  onApiKeyChange?: (hasKey: boolean) => void;
}

export default function ApiKeySection({ onApiKeyChange }: ApiKeySectionProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [deletingKey, setDeletingKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    // Migrate old single API key format if needed
    migrateOldApiKey();
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    const keys = getAllApiKeys();
    setApiKeys(keys);
    const hasActive = keys.some(k => k.isActive);
    onApiKeyChange?.(hasActive);
  };

  const handleToggleActive = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      updateApiKey(id, { isActive: !key.isActive });
      loadApiKeys();
    }
  };

  const calculateSummary = () => {
    const totalCredits = apiKeys.reduce((sum, key) => sum + key.creditsPerMonth, 0);
    const creditsUsed = apiKeys.reduce((sum, key) => sum + key.creditsUsed, 0);
    const activeAccounts = apiKeys.filter(k => k.isActive).length;
    const usagePercentage = totalCredits > 0 ? (creditsUsed / totalCredits) * 100 : 0;

    return {
      totalCredits,
      creditsUsed,
      activeAccounts,
      usagePercentage: Math.min(100, Math.max(0, usagePercentage)),
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">API Keys</h3>
          <p className="text-xs text-gray-500 mt-1">
            Manage your RapidAPI accounts for job search
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add API Key
        </button>
      </div>

      {/* Credit Summary */}
      {apiKeys.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">TOTAL CREDITS</p>
              <p className="text-xl font-bold text-gray-900">
                {summary.totalCredits.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">CREDITS USED</p>
              <p className="text-xl font-bold text-gray-900">
                {summary.creditsUsed.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ACTIVE ACCOUNTS</p>
              <p className="text-xl font-bold text-gray-900">{summary.activeAccounts}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Usage</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  summary.usagePercentage >= 90
                    ? 'bg-red-500'
                    : summary.usagePercentage >= 75
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${summary.usagePercentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {summary.usagePercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No API keys configured</p>
          <p className="text-xs text-gray-400">Click "Add API Key" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((key) => {
            const usagePercentage = key.creditsPerMonth > 0 
              ? (key.creditsUsed / key.creditsPerMonth) * 100 
              : 0;
            
            return (
              <div
                key={key.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{key.name}</h4>
                      {key.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{key.host}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-600">
                        {key.creditsUsed.toLocaleString()} / {key.creditsPerMonth.toLocaleString()} (
                        {Math.min(100, Math.max(0, usagePercentage)).toFixed(0)}%)
                      </span>
                      {key.rpmLimit && (
                        <span className="text-gray-600">{key.rpmLimit} RPM</span>
                      )}
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usagePercentage >= 90
                            ? 'bg-red-500'
                            : usagePercentage >= 75
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, usagePercentage))}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={key.isActive}
                        onChange={() => handleToggleActive(key.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingKey(key)}
                      className="p-1.5 text-gray-500 hover:text-blue-600"
                      aria-label="Edit API key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => setDeletingKey(key)}
                      className="p-1.5 text-gray-500 hover:text-red-600"
                      aria-label="Delete API key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddApiKeyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={loadApiKeys}
      />
      <EditApiKeyModal
        apiKey={editingKey}
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
        onSave={loadApiKeys}
      />
      <DeleteApiKeyModal
        apiKey={deletingKey}
        isOpen={!!deletingKey}
        onClose={() => setDeletingKey(null)}
        onDelete={loadApiKeys}
      />
    </div>
  );
}
