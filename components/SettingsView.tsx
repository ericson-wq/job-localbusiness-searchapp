'use client';

import { useState } from 'react';
import ApiKeySection from './ApiKeySection';
import LocalBusinessApiKeySection from './LocalBusinessApiKeySection';

type SettingsSubSection = 'api-keys' | 'local-business-api-keys';

interface SettingsViewProps {
  activeSubSection: SettingsSubSection;
  onSubSectionChange: (subSection: SettingsSubSection) => void;
  onApiKeyChange?: (hasKey: boolean) => void;
  onLocalBusinessApiKeyChange?: (hasKey: boolean) => void;
}

export default function SettingsView({
  activeSubSection,
  onSubSectionChange,
  onApiKeyChange,
  onLocalBusinessApiKeyChange,
}: SettingsViewProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <span className="text-gray-700 font-medium">Settings</span>
          </li>
          <li>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium">
              {activeSubSection === 'api-keys' ? 'Job Search API Keys' : 'Local Business API Keys'}
            </span>
          </li>
        </ol>
      </nav>

      {/* Subsection Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onSubSectionChange('api-keys')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubSection === 'api-keys'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Job Search API Keys
          </button>
          <button
            onClick={() => onSubSectionChange('local-business-api-keys')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubSection === 'local-business-api-keys'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Local Business API Keys
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div>
        {activeSubSection === 'api-keys' ? (
          <ApiKeySection onApiKeyChange={onApiKeyChange} />
        ) : (
          <LocalBusinessApiKeySection onApiKeyChange={onLocalBusinessApiKeyChange} />
        )}
      </div>
    </div>
  );
}
