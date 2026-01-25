'use client';

import { useState } from 'react';
import ApiKeySection from './ApiKeySection';

interface SettingsViewProps {
  activeSubSection: 'api-keys';
  onSubSectionChange: (subSection: 'api-keys') => void;
  onApiKeyChange?: (hasKey: boolean) => void;
}

export default function SettingsView({
  activeSubSection,
  onSubSectionChange,
  onApiKeyChange,
}: SettingsViewProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </a>
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
            <span className="text-gray-900 font-medium">Api-keys</span>
          </li>
        </ol>
      </nav>

      {/* Settings Content */}
      <div>
        <ApiKeySection onApiKeyChange={onApiKeyChange} />
      </div>
    </div>
  );
}
