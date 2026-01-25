'use client';

import { useState } from 'react';
import { SearchJobsParams } from '@/lib/jsearch-api';

interface SearchSectionProps {
  onSearch: (params: SearchJobsParams) => void;
  isDisabled?: boolean;
}

// Info Icon Component with Tooltip
function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <span className="relative inline-flex items-center group">
      <svg
        className="w-4 h-4 text-gray-400 ml-1 cursor-help flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-72 max-w-[calc(100vw-2rem)] pointer-events-none whitespace-normal leading-relaxed">
        {tooltip}
        <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1">
          <div className="border-4 border-transparent border-r-gray-900"></div>
        </div>
      </div>
    </span>
  );
}

export default function SearchSection({ onSearch, isDisabled }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [country, setCountry] = useState('us');
  const [language, setLanguage] = useState('');
  const [datePosted, setDatePosted] = useState<'all' | 'today' | '3days' | 'week' | 'month'>('all');
  const [workFromHome, setWorkFromHome] = useState(false);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [jobRequirements, setJobRequirements] = useState<string[]>([]);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [excludeJobPublishers, setExcludeJobPublishers] = useState('');
  const [fields, setFields] = useState('');

  const handleEmploymentTypeChange = (type: string) => {
    setEmploymentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleJobRequirementChange = (requirement: string) => {
    setJobRequirements(prev =>
      prev.includes(requirement) ? prev.filter(r => r !== requirement) : [...prev, requirement]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    const params: SearchJobsParams = {
      query: query.trim(),
      page,
      num_pages: numPages,
      country,
      date_posted: datePosted,
      work_from_home: workFromHome || undefined,
    };

    if (language.trim()) {
      params.language = language.trim();
    }

    if (employmentTypes.length > 0) {
      params.employment_types = employmentTypes.join(',');
    }

    if (jobRequirements.length > 0) {
      params.job_requirements = jobRequirements.join(',');
    }

    if (radius !== undefined && radius > 0) {
      params.radius = radius;
    }

    if (excludeJobPublishers.trim()) {
      params.exclude_job_publishers = excludeJobPublishers.trim();
    }

    if (fields.trim()) {
      params.fields = fields.trim();
    }

    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Search Parameters</h3>
      
      {/* Query - Required */}
      <div>
        <label htmlFor="query" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Job Search Query <span className="text-red-500">*</span>
          <InfoIcon tooltip="Enter your job search query including job title and location. For example: 'web development jobs in chicago' or 'software engineer remote'. This field is required." />
        </label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="GTM Engineering jobs in New York"
          required
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Page */}
        <div>
          <label htmlFor="page" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Page
            <InfoIcon tooltip="Specify which page of results you want to retrieve. Starts at page 1. Maximum is 50 pages." />
          </label>
          <input
            id="page"
            type="number"
            min="1"
            max="50"
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value) || 1)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Num Pages */}
        <div>
          <label htmlFor="num_pages" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Num Pages
            <InfoIcon tooltip="Number of pages to retrieve in a single search. Set to 1 to get results from the current page only, or increase to fetch multiple pages at once." />
          </label>
          <input
            id="num_pages"
            type="number"
            min="1"
            value={numPages}
            onChange={(e) => setNumPages(parseInt(e.target.value) || 1)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Country Code
          <InfoIcon tooltip="ISO 3166-1 alpha-2 country code (e.g., 'us' for United States, 'ca' for Canada, 'gb' for United Kingdom). This filters jobs by country." />
        </label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="us"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Language Code
          <InfoIcon tooltip="ISO 639 language code (e.g., 'en' for English, 'es' for Spanish, 'fr' for French). This field is optional and filters jobs by language." />
        </label>
        <input
          id="language"
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="en"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Date Posted */}
      <div>
        <label htmlFor="date_posted" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Date Posted
          <InfoIcon tooltip="Filter jobs by when they were posted. Options: All (no filter), Today, Last 3 Days, Last Week, or Last Month." />
        </label>
        <select
          id="date_posted"
          value={datePosted}
          onChange={(e) => setDatePosted(e.target.value as typeof datePosted)}
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="3days">Last 3 Days</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      {/* Radius */}
      <div>
        <label htmlFor="radius" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Radius (km)
          <InfoIcon tooltip="Optional: Search radius in kilometers from the location specified in your query. Leave empty to search without radius restriction. For example, enter '25' to search within 25 km of the location." />
        </label>
        <input
          id="radius"
          type="number"
          min="0"
          value={radius || ''}
          onChange={(e) => setRadius(e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="Optional"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Work from Home */}
      <div className="flex items-center">
        <input
          id="work_from_home"
          type="checkbox"
          checked={workFromHome}
          onChange={(e) => setWorkFromHome(e.target.checked)}
          disabled={isDisabled}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <label htmlFor="work_from_home" className="ml-2 flex items-center text-sm font-medium text-gray-700">
          Work from Home / Remote Only
          <InfoIcon tooltip="Check this box to filter for remote or work-from-home positions only. When enabled, only jobs that offer remote work options will be shown." />
        </label>
      </div>

      {/* Employment Types */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          Employment Types
          <InfoIcon tooltip="Select one or more employment types to filter jobs: Full-time, Contract, Part-time, or Intern. You can select multiple types." />
        </label>
        <div className="space-y-1">
          {['FULLTIME', 'CONTRACTOR', 'PARTTIME', 'INTERN'].map((type) => {
            const displayLabels: Record<string, string> = {
              'FULLTIME': 'Full-time',
              'CONTRACTOR': 'Contract',
              'PARTTIME': 'Part-time',
              'INTERN': 'Intern'
            };
            return (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={employmentTypes.includes(type)}
                  onChange={() => handleEmploymentTypeChange(type)}
                  disabled={isDisabled}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-gray-700">{displayLabels[type] || type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Job Requirements */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          Job Requirements
          <InfoIcon tooltip="Filter jobs by experience and education requirements. Options: Under 3 Years Experience, More Than 3 Years Experience, No Experience, or No Degree. You can select multiple requirements." />
        </label>
        <div className="space-y-1">
          {[
            'under_3_years_experience',
            'more_than_3_years_experience',
            'no_experience',
            'no_degree'
          ].map((req) => (
            <label key={req} className="flex items-center">
              <input
                type="checkbox"
                checked={jobRequirements.includes(req)}
                onChange={() => handleJobRequirementChange(req)}
                disabled={isDisabled}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <span className="ml-2 text-sm text-gray-700">
                {req.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Exclude Job Publishers */}
      <div>
        <label htmlFor="exclude_publishers" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Exclude Job Publishers
          <InfoIcon tooltip="Optional: Comma-separated list of job publishers to exclude from results. For example: 'BeeBe, Dice'. Jobs from these publishers will not appear in your search results." />
        </label>
        <input
          id="exclude_publishers"
          type="text"
          value={excludeJobPublishers}
          onChange={(e) => setExcludeJobPublishers(e.target.value)}
          placeholder="Clay"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Fields */}
      <div>
        <label htmlFor="fields" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Fields (Optional)
          <InfoIcon tooltip="Optional: Comma-separated list of specific fields to include in the response. For example: 'employer_name,job_title,job_country'. Leave empty to retrieve all available fields. This can help reduce response size." />
        </label>
        <input
          id="fields"
          type="text"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          placeholder="e.g., employer_name,job_title"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isDisabled || !query.trim()}
        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-sm"
      >
        Search Jobs
      </button>
    </form>
  );
}
