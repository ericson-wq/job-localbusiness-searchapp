'use client';

import { useState, useRef, useEffect } from 'react';
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

// Country list with ISO 3166-1 alpha-2 codes
const COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'ca', name: 'Canada' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'it', name: 'Italy' },
  { code: 'es', name: 'Spain' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'at', name: 'Austria' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'dk', name: 'Denmark' },
  { code: 'fi', name: 'Finland' },
  { code: 'ie', name: 'Ireland' },
  { code: 'pl', name: 'Poland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'gr', name: 'Greece' },
  { code: 'cz', name: 'Czech Republic' },
  { code: 'hu', name: 'Hungary' },
  { code: 'ro', name: 'Romania' },
  { code: 'bg', name: 'Bulgaria' },
  { code: 'hr', name: 'Croatia' },
  { code: 'sk', name: 'Slovakia' },
  { code: 'si', name: 'Slovenia' },
  { code: 'ee', name: 'Estonia' },
  { code: 'lv', name: 'Latvia' },
  { code: 'lt', name: 'Lithuania' },
  { code: 'lu', name: 'Luxembourg' },
  { code: 'mt', name: 'Malta' },
  { code: 'cy', name: 'Cyprus' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' },
  { code: 'cn', name: 'China' },
  { code: 'in', name: 'India' },
  { code: 'sg', name: 'Singapore' },
  { code: 'my', name: 'Malaysia' },
  { code: 'th', name: 'Thailand' },
  { code: 'ph', name: 'Philippines' },
  { code: 'id', name: 'Indonesia' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'za', name: 'South Africa' },
  { code: 'eg', name: 'Egypt' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'il', name: 'Israel' },
  { code: 'tr', name: 'Turkey' },
  { code: 'mx', name: 'Mexico' },
  { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' },
  { code: 'pe', name: 'Peru' },
  { code: 've', name: 'Venezuela' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'uy', name: 'Uruguay' },
  { code: 'py', name: 'Paraguay' },
  { code: 'bo', name: 'Bolivia' },
  { code: 'cr', name: 'Costa Rica' },
  { code: 'pa', name: 'Panama' },
  { code: 'gt', name: 'Guatemala' },
  { code: 'hn', name: 'Honduras' },
  { code: 'ni', name: 'Nicaragua' },
  { code: 'sv', name: 'El Salvador' },
  { code: 'do', name: 'Dominican Republic' },
  { code: 'cu', name: 'Cuba' },
  { code: 'jm', name: 'Jamaica' },
  { code: 'tt', name: 'Trinidad and Tobago' },
  { code: 'bb', name: 'Barbados' },
  { code: 'bz', name: 'Belize' },
  { code: 'gy', name: 'Guyana' },
  { code: 'sr', name: 'Suriname' },
  { code: 'ru', name: 'Russia' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'by', name: 'Belarus' },
  { code: 'kz', name: 'Kazakhstan' },
  { code: 'uz', name: 'Uzbekistan' },
  { code: 'ge', name: 'Georgia' },
  { code: 'am', name: 'Armenia' },
  { code: 'az', name: 'Azerbaijan' },
].sort((a, b) => a.name.localeCompare(b.name));

// Language list with ISO 639-1 codes
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tl', name: 'Filipino' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'et', name: 'Estonian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'be', name: 'Belarusian' },
  { code: 'ka', name: 'Georgian' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'fa', name: 'Persian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'my', name: 'Burmese' },
  { code: 'km', name: 'Khmer' },
  { code: 'lo', name: 'Lao' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sw', name: 'Swahili' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'Zulu' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'am', name: 'Amharic' },
  { code: 'eu', name: 'Basque' },
  { code: 'ca', name: 'Catalan' },
  { code: 'gl', name: 'Galician' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ga', name: 'Irish' },
  { code: 'mt', name: 'Maltese' },
  { code: 'cy', name: 'Welsh' },
].sort((a, b) => a.name.localeCompare(b.name));

// Common job publishers list
const JOB_PUBLISHERS = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'ZipRecruiter',
  'Monster',
  'CareerBuilder',
  'Dice',
  'BeeBe',
  'SimplyHired',
  'Adzuna',
  'Jooble',
  'Talent.com',
  'Snagajob',
  'FlexJobs',
  'Upwork',
  'Freelancer',
  'Guru',
  'Toptal',
  'AngelList',
  'Stack Overflow Jobs',
  'GitHub Jobs',
  'Remote.co',
  'We Work Remotely',
  'Working Nomads',
  'Jobbatical',
  'Hired',
  'Triplebyte',
  'HackerRank Jobs',
  'Ladders',
  'The Muse',
  'Vault',
  'WayUp',
  'Handshake',
  'CollegeGrad',
  'Internships.com',
  'Idealist',
  'USAJobs',
  'GovernmentJobs',
  'CoolWorks',
  'SeasonalJobs',
  'Motion Recruitment',
  'Capital One Career',
  'Freddie Mac Careers',
  'Amazon Jobs',
  'Google Careers',
  'Microsoft Careers',
  'Apple Jobs',
  'Meta Careers',
  'Netflix Jobs',
  'Tesla Careers',
].sort((a, b) => a.localeCompare(b));

// Validated list of fields that are known to work with the JSearch API fields parameter
// Some fields may be returned by default but cannot be explicitly requested via the fields parameter
// Fields that are commonly problematic are excluded from this list
const VALIDATED_FIELDS = new Set([
  'job_id',
  'job_title',
  'employer_name',
  'employer_logo',
  'employer_website',
  'job_publisher',
  'job_employment_type',
  'job_employment_types',
  'job_apply_link',
  'job_apply_is_direct',
  'apply_options',
  'job_description',
  'job_is_remote',
  'job_posted_at',
  'job_posted_at_timestamp',
  'job_posted_at_datetime_utc',
  'job_location',
  'job_city',
  'job_state',
  'job_country',
  'job_latitude',
  'job_longitude',
  'job_benefits',
  'job_google_link',
  'job_min_salary',
  'job_max_salary',
  'job_salary_period',
  'job_highlights',
  // Excluded fields that may cause 400 errors:
  // - job_onet_soc: May not be valid for fields parameter
  // - job_onet_job_zone: May not be valid for fields parameter
  // These fields will still be returned by default when fields parameter is not used
]);

// Available job fields for field projection
const JOB_FIELDS = [
  { value: 'job_id', label: 'Job ID' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'employer_name', label: 'Employer Name' },
  { value: 'employer_logo', label: 'Employer Logo' },
  { value: 'employer_website', label: 'Employer Website' },
  { value: 'job_publisher', label: 'Job Publisher' },
  { value: 'job_employment_type', label: 'Employment Type' },
  { value: 'job_employment_types', label: 'Employment Types (Array)' },
  { value: 'job_apply_link', label: 'Apply Link' },
  { value: 'job_apply_is_direct', label: 'Apply Is Direct' },
  { value: 'apply_options', label: 'Apply Options' },
  { value: 'job_description', label: 'Job Description' },
  { value: 'job_is_remote', label: 'Is Remote' },
  { value: 'job_posted_at', label: 'Posted At' },
  { value: 'job_posted_at_timestamp', label: 'Posted At Timestamp' },
  { value: 'job_posted_at_datetime_utc', label: 'Posted At (UTC)' },
  { value: 'job_location', label: 'Location' },
  { value: 'job_city', label: 'City' },
  { value: 'job_state', label: 'State' },
  { value: 'job_country', label: 'Country' },
  { value: 'job_latitude', label: 'Latitude' },
  { value: 'job_longitude', label: 'Longitude' },
  { value: 'job_benefits', label: 'Benefits' },
  { value: 'job_google_link', label: 'Google Link' },
  { value: 'job_min_salary', label: 'Min Salary' },
  { value: 'job_max_salary', label: 'Max Salary' },
  { value: 'job_salary_period', label: 'Salary Period' },
  { value: 'job_highlights', label: 'Job Highlights' },
  { value: 'job_onet_soc', label: 'O*NET SOC Code' },
  { value: 'job_onet_job_zone', label: 'O*NET Job Zone' },
].sort((a, b) => a.label.localeCompare(b.label));

// Multi-select dropdown component
interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  tooltip?: string;
}

function MultiSelect({ 
  label, 
  options, 
  selectedValues, 
  onChange, 
  placeholder = 'Select options...',
  disabled = false,
  tooltip
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (value: string) => {
    if (disabled) return;
    
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const displayText = selectedValues.length === 0 
    ? placeholder 
    : selectedValues.length === 1
    ? options.find(opt => opt.value === selectedValues[0])?.label || placeholder
    : `${selectedValues.length} selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        {label}
        {tooltip && <InfoIcon tooltip={tooltip} />}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm flex items-center justify-between"
      >
        <span className={selectedValues.length === 0 ? 'text-gray-500' : ''}>
          {displayText}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchSection({ onSearch, isDisabled }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [numResults, setNumResults] = useState(10);
  const [country, setCountry] = useState('us');
  const [language, setLanguage] = useState('');
  const [datePosted, setDatePosted] = useState<'all' | 'today' | '3days' | 'week' | 'month'>('all');
  const [workFromHome, setWorkFromHome] = useState(false);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [jobRequirements, setJobRequirements] = useState<string[]>([]);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [excludeJobPublishers, setExcludeJobPublishers] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    // Calculate num_pages from desired number of results
    // Each page contains up to 10 results, so we round up
    const calculatedNumPages = Math.ceil(numResults / 10);
    // Cap at 50 pages (API limit)
    const numPages = Math.min(calculatedNumPages, 50);

    const params: SearchJobsParams = {
      query: query.trim(),
      page: 1, // Always start from page 1
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

    if (excludeJobPublishers.length > 0) {
      params.exclude_job_publishers = excludeJobPublishers.join(',');
    }

    if (fields.length > 0) {
      // Filter out any empty or invalid field values
      // Only include fields that are in the validated list
      const validFields = fields
        .filter(f => f && f.trim().length > 0)
        .filter(f => VALIDATED_FIELDS.has(f.trim()));
      
      // Check if any fields were filtered out
      const invalidFields = fields
        .filter(f => f && f.trim().length > 0)
        .filter(f => !VALIDATED_FIELDS.has(f.trim()));
      
      if (invalidFields.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('Filtered out invalid fields:', invalidFields);
      }
      
      if (validFields.length > 0) {
        params.fields = validFields.join(',');
      }
      // If no valid fields remain after filtering, don't include the fields parameter
      // This allows the API to return all fields by default
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
          placeholder="Companies hiring Data Engineers in New York"
          required
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Number of Results */}
      <div>
        <label htmlFor="num_results" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Number of Results
          <InfoIcon tooltip="Enter the number of job results you want to retrieve. Results are fetched in pages of 10, so you may receive slightly more results than requested (e.g., requesting 25 results will fetch 30 results from 3 pages). Maximum is 500 results (50 pages × 10 results per page)." />
        </label>
        <input
          id="num_results"
          type="number"
          min="1"
          max="500"
          value={numResults}
          onChange={(e) => setNumResults(parseInt(e.target.value) || 10)}
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Country
          <InfoIcon tooltip="Select a country to filter job search results. The API uses ISO 3166-1 alpha-2 country codes internally (e.g., 'us' for United States)." />
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        >
          {COUNTRIES.map((countryOption) => (
            <option key={countryOption.code} value={countryOption.code}>
              {countryOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Language
          <InfoIcon tooltip="Select a language to filter job search results. This field is optional - leave it as 'Any Language' to search all languages. The API uses ISO 639-1 language codes internally (e.g., 'en' for English)." />
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        >
          <option value="">Any Language</option>
          {LANGUAGES.map((languageOption) => (
            <option key={languageOption.code} value={languageOption.code}>
              {languageOption.name}
            </option>
          ))}
        </select>
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
      <MultiSelect
        label="Employment Types"
        options={[
          { value: 'FULLTIME', label: 'Full-time' },
          { value: 'CONTRACTOR', label: 'Contract' },
          { value: 'PARTTIME', label: 'Part-time' },
          { value: 'INTERN', label: 'Intern' }
        ]}
        selectedValues={employmentTypes}
        onChange={(values) => setEmploymentTypes(values)}
        placeholder="Select employment types..."
        disabled={isDisabled}
        tooltip="Select one or more employment types to filter jobs: Full-time, Contract, Part-time, or Intern. You can select multiple types."
      />

      {/* Job Requirements */}
      <MultiSelect
        label="Job Requirements"
        options={[
          { value: 'under_3_years_experience', label: 'Under 3 Years Experience' },
          { value: 'more_than_3_years_experience', label: 'More Than 3 Years Experience' },
          { value: 'no_experience', label: 'No Experience' },
          { value: 'no_degree', label: 'No Degree' }
        ]}
        selectedValues={jobRequirements}
        onChange={(values) => setJobRequirements(values)}
        placeholder="Select job requirements..."
        disabled={isDisabled}
        tooltip="Filter jobs by experience and education requirements. Options: Under 3 Years Experience, More Than 3 Years Experience, No Experience, or No Degree. You can select multiple requirements."
      />

      {/* Exclude Job Publishers */}
      <MultiSelect
        label="Exclude Job Publishers"
        options={JOB_PUBLISHERS.map(publisher => ({ value: publisher, label: publisher }))}
        selectedValues={excludeJobPublishers}
        onChange={(values) => setExcludeJobPublishers(values)}
        placeholder="Select publishers to exclude..."
        disabled={isDisabled}
        tooltip="Select one or more job publishers to exclude from search results. Jobs from selected publishers will not appear in your results. You can select multiple publishers."
      />

      {/* Fields */}
      <MultiSelect
        label="Fields (Optional)"
        options={JOB_FIELDS}
        selectedValues={fields}
        onChange={(values) => setFields(values)}
        placeholder="Select fields to include (leave empty for all fields)..."
        disabled={isDisabled}
        tooltip="Select specific fields to include in the API response. This helps reduce response size by only returning the fields you need. Leave empty to retrieve all available fields. You can select multiple fields."
      />

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
