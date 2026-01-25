'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsView from '@/components/SettingsView';
import ResultsDisplay from '@/components/ResultsDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchJobs, SearchJobsParams, ApiKeyError, ApiError } from '@/lib/jsearch-api';
import { JobSearchResponse } from '@/types/job';
import { jobToDisplay, JobDisplay } from '@/types/job';
import { hasApiKey } from '@/lib/api-key-storage';

const SIDEBAR_WIDTH_KEY = 'job-search-sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 320; // w-80 = 320px

type MainView = 'search' | 'settings';

export default function Home() {
  const [mainView, setMainView] = useState<MainView>('search');
  const [settingsSubSection, setSettingsSubSection] = useState<'api-keys'>('api-keys');
  const [hasApiKeyConfigured, setHasApiKeyConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<JobDisplay[]>([]);
  const [totalResults, setTotalResults] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  useEffect(() => {
    // Check if API key exists on mount
    setHasApiKeyConfigured(hasApiKey());
    
    // Load saved sidebar width from localStorage
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= 200 && width <= 800) {
        setSidebarWidth(width);
      }
    }
  }, []);

  const handleSidebarResize = (width: number) => {
    setSidebarWidth(width);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, width.toString());
  };

  const handleSearch = async (params: SearchJobsParams) => {
    if (!hasApiKeyConfigured) {
      setError('Please configure your RapidAPI key first');
      setMainView('settings');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setSearchResults([]);

    try {
      const response: JobSearchResponse = await searchJobs(params);
      
      if (response.data && response.data.length > 0) {
        const displayJobs = response.data.map(job => jobToDisplay(job));
        setSearchResults(displayJobs);
        setTotalResults(displayJobs.length);
        setSuccess(`Found ${displayJobs.length} job(s)`);
        // Switch to search view after successful search
        setMainView('search');
      } else {
        setSearchResults([]);
        setSuccess('No jobs found. Try adjusting your search parameters.');
      }
    } catch (err) {
      if (err instanceof ApiKeyError) {
        setError(err.message);
        setHasApiKeyConfigured(false);
        setMainView('settings');
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (hasKey: boolean) => {
    setHasApiKeyConfigured(hasKey);
    if (!hasKey) {
      setSearchResults([]);
      setError(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar
        onSearch={handleSearch}
        isSearchDisabled={!hasApiKeyConfigured || isLoading}
        width={sidebarWidth}
        onResize={handleSidebarResize}
        onNavigate={setMainView}
        currentView={mainView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {mainView === 'settings' ? 'Settings' : 'Job Search'}
              </h1>
              <p className="text-sm text-gray-600">
                {mainView === 'settings'
                  ? 'Manage your application settings'
                  : 'Search for available jobs using this app'}
              </p>
            </div>
            {mainView === 'search' && (
              <button
                onClick={() => setMainView('settings')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Settings
              </button>
            )}
            {mainView === 'settings' && (
              <button
                onClick={() => setMainView('search')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Search
              </button>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-blue-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {mainView === 'settings' ? (
            <SettingsView
              activeSubSection={settingsSubSection}
              onSubSectionChange={setSettingsSubSection}
              onApiKeyChange={handleApiKeyChange}
            />
          ) : (
            <>
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              )}

              {/* Results */}
              {!isLoading && searchResults.length > 0 && (
                <ResultsDisplay 
                  jobs={searchResults} 
                  totalResults={totalResults}
                />
              )}

              {/* Empty State */}
              {!isLoading && searchResults.length === 0 && hasApiKeyConfigured && !error && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter your search criteria in the sidebar and click "Search Jobs" to find available positions.
                    </p>
                  </div>
                </div>
              )}

              {/* No API Key State */}
              {!hasApiKeyConfigured && !isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">API Key Required</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please configure your RapidAPI key in Settings to start searching for jobs.
                    </p>
                    <button
                      onClick={() => setMainView('settings')}
                      className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                    >
                      Go to Settings
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
