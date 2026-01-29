'use client';

import { useState } from 'react';
import { LocalBusinessSearchParams } from '@/types/local-business';

interface LocalBusinessSearchSectionProps {
  onSearch: (params: LocalBusinessSearchParams) => void;
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

export default function LocalBusinessSearchSection({ onSearch, isDisabled }: LocalBusinessSearchSectionProps) {
  const [query, setQuery] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [limit, setLimit] = useState(20);
  const [region, setRegion] = useState('us');
  const [language, setLanguage] = useState('en');
  const [extractEmailsAndContacts, setExtractEmailsAndContacts] = useState(false);
  const [subtypes, setSubtypes] = useState('');
  const [businessStatus, setBusinessStatus] = useState('');
  const [verified, setVerified] = useState(false);
  const [fields, setFields] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    const params: LocalBusinessSearchParams = {
      query: query.trim(),
      limit,
      region,
      language,
      extract_emails_and_contacts: extractEmailsAndContacts,
    };

    if (lat !== undefined) {
      params.lat = lat;
    }

    if (lng !== undefined) {
      params.lng = lng;
    }

    if (subtypes.trim()) {
      params.subtypes = subtypes.trim();
    }

    if (businessStatus.trim()) {
      params.business_status = businessStatus.trim();
    }

    if (verified) {
      params.verified = verified;
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
          Search Query <span className="text-red-500">*</span>
          <InfoIcon tooltip="Enter your business search query. For example: 'coffee shops in San Francisco' or 'plumbers near New York'. This field is required." />
        </label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="coffee shops in San Francisco"
          required
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Latitude */}
        <div>
          <label htmlFor="lat" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Latitude
            <InfoIcon tooltip="Optional: Latitude coordinate to bias search results towards a specific location." />
          </label>
          <input
            id="lat"
            type="number"
            step="any"
            value={lat || ''}
            onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="37.7749"
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Longitude */}
        <div>
          <label htmlFor="lng" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Longitude
            <InfoIcon tooltip="Optional: Longitude coordinate to bias search results towards a specific location." />
          </label>
          <input
            id="lng"
            type="number"
            step="any"
            value={lng || ''}
            onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="-122.4194"
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Limit */}
        <div>
          <label htmlFor="limit" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Limit
            <InfoIcon tooltip="Maximum number of businesses to return (1-500). Default is 20." />
          </label>
          <input
            id="limit"
            type="number"
            min="1"
            max="500"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Region */}
        <div>
          <label htmlFor="region" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            Region Code
            <InfoIcon tooltip="ISO 3166-1 alpha-2 country code (e.g., 'us' for United States, 'ca' for Canada). Default is 'us'." />
          </label>
          <input
            id="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="us"
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Language Code
          <InfoIcon tooltip="ISO 639 language code (e.g., 'en' for English, 'es' for Spanish). Default is 'en'." />
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

      {/* Extract Emails and Contacts */}
      <div className="flex items-center">
        <input
          id="extract_emails"
          type="checkbox"
          checked={extractEmailsAndContacts}
          onChange={(e) => setExtractEmailsAndContacts(e.target.checked)}
          disabled={isDisabled}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <label htmlFor="extract_emails" className="ml-2 flex items-center text-sm font-medium text-gray-700">
          Extract Emails and Contacts
          <InfoIcon tooltip="When enabled, the API will scrape emails and contacts from business websites. This may incur additional credits per business." />
        </label>
      </div>

      {/* Subtypes */}
      <div>
        <label htmlFor="subtypes" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Subtypes
          <InfoIcon tooltip="Optional: Comma-separated list of business subtypes/categories. For example: 'Plumber,Carpenter,Electrician'." />
        </label>
        <input
          id="subtypes"
          type="text"
          value={subtypes}
          onChange={(e) => setSubtypes(e.target.value)}
          placeholder="Plumber,Carpenter"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Business Status */}
      <div>
        <label htmlFor="business_status" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Business Status
          <InfoIcon tooltip="Optional: Filter by business status. Values: 'OPEN', 'CLOSED_TEMPORARILY', 'CLOSED'. Can be comma-separated." />
        </label>
        <input
          id="business_status"
          type="text"
          value={businessStatus}
          onChange={(e) => setBusinessStatus(e.target.value)}
          placeholder="OPEN"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
      </div>

      {/* Verified */}
      <div className="flex items-center">
        <input
          id="verified"
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
          disabled={isDisabled}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <label htmlFor="verified" className="ml-2 flex items-center text-sm font-medium text-gray-700">
          Verified Businesses Only
          <InfoIcon tooltip="When enabled, only return verified businesses." />
        </label>
      </div>

      {/* Fields */}
      <div>
        <label htmlFor="fields" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Fields (Optional)
          <InfoIcon tooltip="Optional: Comma-separated list of specific fields to include in the response. Leave empty to retrieve all fields." />
        </label>
        <input
          id="fields"
          type="text"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          placeholder="business_id,name,phone_number,full_address"
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
        Search Businesses
      </button>
    </form>
  );
}
