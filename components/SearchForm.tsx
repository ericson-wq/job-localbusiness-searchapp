'use client';

import { useState } from 'react';
import { SearchJobsParams } from '@/lib/jsearch-api';

interface SearchFormProps {
  onSubmit: (params: SearchJobsParams) => void;
  isDisabled?: boolean;
}

export default function SearchForm({ onSubmit, isDisabled }: SearchFormProps) {
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

    onSubmit(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Query - Required */}
          <div className="md:col-span-2">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Search Query <span className="text-red-500">*</span>
            </label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., web development jobs in chicago"
              required
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Include job title and location for best results
            </p>
          </div>

          {/* Page */}
          <div>
            <label htmlFor="page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page
            </label>
            <input
              id="page"
              type="number"
              min="1"
              max="50"
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value) || 1)}
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Num Pages */}
          <div>
            <label htmlFor="num_pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Pages
            </label>
            <input
              id="num_pages"
              type="number"
              min="1"
              value={numPages}
              onChange={(e) => setNumPages(parseInt(e.target.value) || 1)}
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country Code
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="us"
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              ISO 3166-1 alpha-2 code (e.g., us, ca, gb)
            </p>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language Code
            </label>
            <input
              id="language"
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="en"
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              ISO 639 language code (optional)
            </p>
          </div>

          {/* Date Posted */}
          <div>
            <label htmlFor="date_posted" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Posted
            </label>
            <select
              id="date_posted"
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value as typeof datePosted)}
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Radius (km)
            </label>
            <input
              id="radius"
              type="number"
              min="0"
              value={radius || ''}
              onChange={(e) => setRadius(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Optional"
              disabled={isDisabled}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <label htmlFor="work_from_home" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Work from Home / Remote Only
            </label>
          </div>
        </div>

        {/* Employment Types */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employment Types
          </label>
          <div className="flex flex-wrap gap-3">
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{displayLabels[type] || type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Job Requirements */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Requirements
          </label>
          <div className="flex flex-wrap gap-3">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {req.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Exclude Job Publishers */}
        <div className="mt-4">
          <label htmlFor="exclude_publishers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exclude Job Publishers
          </label>
          <input
            id="exclude_publishers"
            type="text"
            value={excludeJobPublishers}
            onChange={(e) => setExcludeJobPublishers(e.target.value)}
            placeholder="e.g., BeeBe, Dice"
            disabled={isDisabled}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Comma-separated list of publishers to exclude
          </p>
        </div>

        {/* Fields */}
        <div className="mt-4">
          <label htmlFor="fields" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fields (Optional)
          </label>
          <input
            id="fields"
            type="text"
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            placeholder="e.g., employer_name,job_title,job_country"
            disabled={isDisabled}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Comma-separated list of fields to include (leave empty for all fields)
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isDisabled || !query.trim()}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Search Jobs
          </button>
        </div>
      </div>
    </form>
  );
}
