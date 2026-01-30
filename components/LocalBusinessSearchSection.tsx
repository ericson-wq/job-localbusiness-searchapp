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

// Business Status options
const BUSINESS_STATUS_OPTIONS = [
  'OPEN',
  'CLOSED_TEMPORARILY',
  'CLOSED'
];

// Helper function to format business status for display
function formatBusinessStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'OPEN': 'Open',
    'CLOSED_TEMPORARILY': 'Closed Temporarily',
    'CLOSED': 'Closed'
  };
  return statusMap[status] || status;
}

// Country/Region mapping: Country Name -> Region Code (ISO 3166-1 alpha-2)
const COUNTRY_REGION_MAP: Array<{ name: string; code: string }> = [
  { name: 'United States', code: 'us' },
  { name: 'Canada', code: 'ca' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'Australia', code: 'au' },
  { name: 'Germany', code: 'de' },
  { name: 'France', code: 'fr' },
  { name: 'Italy', code: 'it' },
  { name: 'Spain', code: 'es' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Belgium', code: 'be' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Austria', code: 'at' },
  { name: 'Sweden', code: 'se' },
  { name: 'Norway', code: 'no' },
  { name: 'Denmark', code: 'dk' },
  { name: 'Finland', code: 'fi' },
  { name: 'Poland', code: 'pl' },
  { name: 'Portugal', code: 'pt' },
  { name: 'Ireland', code: 'ie' },
  { name: 'Greece', code: 'gr' },
  { name: 'Czech Republic', code: 'cz' },
  { name: 'Hungary', code: 'hu' },
  { name: 'Romania', code: 'ro' },
  { name: 'Bulgaria', code: 'bg' },
  { name: 'Croatia', code: 'hr' },
  { name: 'Slovakia', code: 'sk' },
  { name: 'Slovenia', code: 'si' },
  { name: 'Estonia', code: 'ee' },
  { name: 'Latvia', code: 'lv' },
  { name: 'Lithuania', code: 'lt' },
  { name: 'Japan', code: 'jp' },
  { name: 'South Korea', code: 'kr' },
  { name: 'China', code: 'cn' },
  { name: 'India', code: 'in' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Thailand', code: 'th' },
  { name: 'Philippines', code: 'ph' },
  { name: 'Indonesia', code: 'id' },
  { name: 'Vietnam', code: 'vn' },
  { name: 'Taiwan', code: 'tw' },
  { name: 'Hong Kong', code: 'hk' },
  { name: 'New Zealand', code: 'nz' },
  { name: 'South Africa', code: 'za' },
  { name: 'Brazil', code: 'br' },
  { name: 'Mexico', code: 'mx' },
  { name: 'Argentina', code: 'ar' },
  { name: 'Chile', code: 'cl' },
  { name: 'Colombia', code: 'co' },
  { name: 'Peru', code: 'pe' },
  { name: 'Turkey', code: 'tr' },
  { name: 'Israel', code: 'il' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'Egypt', code: 'eg' },
  { name: 'Russia', code: 'ru' },
  { name: 'Ukraine', code: 'ua' },
  { name: 'Belarus', code: 'by' },
  { name: 'Kazakhstan', code: 'kz' },
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to get country name from region code
function getCountryNameFromCode(code: string): string {
  const country = COUNTRY_REGION_MAP.find(c => c.code === code.toLowerCase());
  return country ? country.name : code.toUpperCase();
}

// Helper function to get region code from country name
function getCodeFromCountryName(name: string): string {
  const country = COUNTRY_REGION_MAP.find(c => c.name === name);
  return country ? country.code : 'us';
}

// Language mapping: Language Name -> Language Code (ISO 639-1)
const LANGUAGE_MAP: Array<{ name: string; code: string }> = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Italian', code: 'it' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Dutch', code: 'nl' },
  { name: 'Russian', code: 'ru' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Korean', code: 'ko' },
  { name: 'Chinese (Simplified)', code: 'zh' },
  { name: 'Chinese (Traditional)', code: 'zh-TW' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Turkish', code: 'tr' },
  { name: 'Polish', code: 'pl' },
  { name: 'Swedish', code: 'sv' },
  { name: 'Norwegian', code: 'no' },
  { name: 'Danish', code: 'da' },
  { name: 'Finnish', code: 'fi' },
  { name: 'Greek', code: 'el' },
  { name: 'Czech', code: 'cs' },
  { name: 'Hungarian', code: 'hu' },
  { name: 'Romanian', code: 'ro' },
  { name: 'Bulgarian', code: 'bg' },
  { name: 'Croatian', code: 'hr' },
  { name: 'Serbian', code: 'sr' },
  { name: 'Slovak', code: 'sk' },
  { name: 'Slovenian', code: 'sl' },
  { name: 'Estonian', code: 'et' },
  { name: 'Latvian', code: 'lv' },
  { name: 'Lithuanian', code: 'lt' },
  { name: 'Ukrainian', code: 'uk' },
  { name: 'Thai', code: 'th' },
  { name: 'Vietnamese', code: 'vi' },
  { name: 'Indonesian', code: 'id' },
  { name: 'Malay', code: 'ms' },
  { name: 'Tagalog', code: 'tl' },
  { name: 'Hebrew', code: 'he' },
  { name: 'Persian', code: 'fa' },
  { name: 'Urdu', code: 'ur' },
  { name: 'Bengali', code: 'bn' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Marathi', code: 'mr' },
  { name: 'Gujarati', code: 'gu' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Malayalam', code: 'ml' },
  { name: 'Punjabi', code: 'pa' },
  { name: 'Swahili', code: 'sw' },
  { name: 'Afrikaans', code: 'af' },
  { name: 'Catalan', code: 'ca' },
  { name: 'Basque', code: 'eu' },
  { name: 'Galician', code: 'gl' },
  { name: 'Icelandic', code: 'is' },
  { name: 'Irish', code: 'ga' },
  { name: 'Welsh', code: 'cy' },
  { name: 'Maltese', code: 'mt' },
  { name: 'Albanian', code: 'sq' },
  { name: 'Macedonian', code: 'mk' },
  { name: 'Bosnian', code: 'bs' },
  { name: 'Georgian', code: 'ka' },
  { name: 'Armenian', code: 'hy' },
  { name: 'Azerbaijani', code: 'az' },
  { name: 'Kazakh', code: 'kk' },
  { name: 'Uzbek', code: 'uz' },
  { name: 'Mongolian', code: 'mn' },
  { name: 'Nepali', code: 'ne' },
  { name: 'Sinhala', code: 'si' },
  { name: 'Burmese', code: 'my' },
  { name: 'Khmer', code: 'km' },
  { name: 'Lao', code: 'lo' },
  { name: 'Amharic', code: 'am' },
  { name: 'Zulu', code: 'zu' },
  { name: 'Xhosa', code: 'xh' },
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to get language name from code
function getLanguageNameFromCode(code: string): string {
  const language = LANGUAGE_MAP.find(l => l.code === code.toLowerCase());
  return language ? language.name : code.toUpperCase();
}

// Helper function to get language code from language name
function getCodeFromLanguageName(name: string): string {
  const language = LANGUAGE_MAP.find(l => l.name === name);
  return language ? language.code : 'en';
}

// Available Business Fields
const FIELD_OPTIONS = [
  'business_id',
  'google_id',
  'place_id',
  'google_mid',
  'name',
  'phone_number',
  'full_address',
  'address',
  'street_address',
  'city',
  'state',
  'country',
  'zipcode',
  'district',
  'latitude',
  'longitude',
  'rating',
  'review_count',
  'type',
  'subtypes',
  'subtype_gcids',
  'business_status',
  'verified',
  'website',
  'tld',
  'place_link',
  'reviews_link',
  'owner_id',
  'owner_link',
  'owner_name',
  'booking_link',
  'reservations_link',
  'order_link',
  'opening_status',
  'working_hours',
  'timezone',
  'price_level',
  'photo_count',
  'photos_sample',
  'reviews_per_rating',
  'about',
  'emails_and_contacts',
  'share_link',
  'cid',
  'hotel_price_for_dates'
].sort();

// Common Business Subtypes
const SUBTYPE_OPTIONS = [
  'Plumber',
  'Carpenter',
  'Electrician',
  'HVAC Contractor',
  'General Contractor',
  'Roofing Contractor',
  'Painting Contractor',
  'Landscaper',
  'Restaurant',
  'Cafe',
  'Bar',
  'Pub',
  'Night Club',
  'Dance Club',
  'Hotel',
  'Motel',
  'Bed & Breakfast',
  'Gym',
  'Fitness Center',
  'Yoga Studio',
  'Spa',
  'Salon',
  'Barbershop',
  'Dentist',
  'Doctor',
  'Hospital',
  'Pharmacy',
  'Veterinarian',
  'Pet Store',
  'Auto Repair',
  'Car Dealer',
  'Gas Station',
  'Bank',
  'ATM',
  'Real Estate Agency',
  'Law Firm',
  'Accounting Firm',
  'Insurance Agency',
  'School',
  'University',
  'Library',
  'Museum',
  'Theater',
  'Movie Theater',
  'Shopping Mall',
  'Grocery Store',
  'Convenience Store',
  'Clothing Store',
  'Electronics Store',
  'Hardware Store',
  'Book Store',
  'Toy Store',
  'Jewelry Store',
  'Florist',
  'Bakery',
  'Pizza Restaurant',
  'Fast Food Restaurant',
  'Coffee Shop',
  'Ice Cream Shop',
  'Supermarket',
  'Gas Station',
  'Parking',
  'Public Transit Station',
  'Airport',
  'Bus Station',
  'Train Station',
  'Taxi Service',
  'Ride Share Service',
  'Car Rental',
  'Travel Agency',
  'Tourist Information',
  'Park',
  'Zoo',
  'Aquarium',
  'Stadium',
  'Convention Center',
  'Event Venue',
  'Wedding Venue',
  'Funeral Home',
  'Cemetery',
  'Church',
  'Mosque',
  'Synagogue',
  'Temple',
  'Post Office',
  'Police Station',
  'Fire Station',
  'City Hall',
  'Court House',
  'Embassy',
  'Consulate'
];

export default function LocalBusinessSearchSection({ onSearch, isDisabled }: LocalBusinessSearchSectionProps) {
  const [query, setQuery] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [limit, setLimit] = useState(20);
  const [region, setRegion] = useState('us');
  const [language, setLanguage] = useState('en');
  const [extractEmailsAndContacts, setExtractEmailsAndContacts] = useState(false);
  const [subtypes, setSubtypes] = useState<string[]>([]);
  const [businessStatus, setBusinessStatus] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [fields, setFields] = useState<string[]>([]);
  const [subtypesDropdownOpen, setSubtypesDropdownOpen] = useState(false);
  const [businessStatusDropdownOpen, setBusinessStatusDropdownOpen] = useState(false);
  const [fieldsDropdownOpen, setFieldsDropdownOpen] = useState(false);

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

    if (subtypes.length > 0) {
      params.subtypes = subtypes.join(',');
    }

    if (businessStatus.length > 0) {
      params.business_status = businessStatus.join(',');
    }

    if (verified) {
      params.verified = verified;
    }

    if (fields.length > 0) {
      params.fields = fields.join(',');
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

      {/* Subtypes */}
      <div className="relative">
        <label htmlFor="subtypes" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Subtypes
          <InfoIcon tooltip="Optional: Select one or more business subtypes/categories. Multiple selections are allowed." />
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSubtypesDropdownOpen(!subtypesDropdownOpen)}
            disabled={isDisabled}
            className="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm bg-white flex items-center justify-between"
          >
            <span className={subtypes.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
              {subtypes.length === 0 ? 'Select subtypes...' : subtypes.join(', ')}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${subtypesDropdownOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {subtypesDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSubtypesDropdownOpen(false)}
              />
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {SUBTYPE_OPTIONS.map((subtype) => (
                  <label
                    key={subtype}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={subtypes.includes(subtype)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSubtypes([...subtypes, subtype]);
                        } else {
                          setSubtypes(subtypes.filter(s => s !== subtype));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{subtype}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
        {subtypes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {subtypes.map((subtype) => (
              <span
                key={subtype}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {subtype}
                <button
                  type="button"
                  onClick={() => setSubtypes(subtypes.filter(s => s !== subtype))}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Business Status */}
      <div className="relative">
        <label htmlFor="business_status" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Business Status
          <InfoIcon tooltip="Optional: Filter by business status. Multiple selections are allowed." />
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setBusinessStatusDropdownOpen(!businessStatusDropdownOpen)}
            disabled={isDisabled}
            className="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm bg-white flex items-center justify-between"
          >
            <span className={businessStatus.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
              {businessStatus.length === 0 ? 'Select business status...' : businessStatus.map(formatBusinessStatus).join(', ')}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${businessStatusDropdownOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {businessStatusDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setBusinessStatusDropdownOpen(false)}
              />
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {BUSINESS_STATUS_OPTIONS.map((status) => (
                  <label
                    key={status}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={businessStatus.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBusinessStatus([...businessStatus, status]);
                        } else {
                          setBusinessStatus(businessStatus.filter(s => s !== status));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{formatBusinessStatus(status)}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
        {businessStatus.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {businessStatus.map((status) => (
              <span
                key={status}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status === 'OPEN'
                    ? 'bg-green-100 text-green-800'
                    : status === 'CLOSED_TEMPORARILY'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {formatBusinessStatus(status)}
                <button
                  type="button"
                  onClick={() => setBusinessStatus(businessStatus.filter(s => s !== status))}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-opacity-80"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
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
            Country/Region
            <InfoIcon tooltip="Select a country or region to filter search results. The system will use the appropriate region code for the API." />
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm bg-white"
          >
            {COUNTRY_REGION_MAP.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fields */}
      <div className="relative">
        <label htmlFor="fields" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Fields (Optional)
          <InfoIcon tooltip="Optional: Select one or more specific fields to include in the response. Leave empty to retrieve all fields." />
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setFieldsDropdownOpen(!fieldsDropdownOpen)}
            disabled={isDisabled}
            className={`w-full px-3 py-2.5 text-left border-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm bg-white flex items-center justify-between transition-colors ${
              fieldsDropdownOpen 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <span className={fields.length === 0 ? 'text-gray-500' : 'text-gray-900 font-medium'}>
              {fields.length === 0 
                ? 'Select fields...' 
                : fields.length === 1 
                  ? fields[0] 
                  : `${fields.length} fields selected`}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${fieldsDropdownOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {fieldsDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10 bg-black bg-opacity-25"
                onClick={() => setFieldsDropdownOpen(false)}
              />
              <div className="absolute z-30 w-full mt-1 bg-white border-2 border-blue-500 rounded-md shadow-2xl max-h-80 overflow-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 z-10">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Select Fields ({fields.length} selected)
                  </div>
                </div>
                <div className="py-1">
                  {FIELD_OPTIONS.map((field) => (
                    <label
                      key={field}
                      className={`flex items-center px-4 py-2.5 cursor-pointer transition-colors ${
                        fields.includes(field)
                          ? 'bg-blue-50 hover:bg-blue-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={fields.includes(field)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFields([...fields, field]);
                          } else {
                            setFields(fields.filter(f => f !== field));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 border-gray-300 rounded cursor-pointer"
                      />
                      <span className={`ml-3 text-sm ${
                        fields.includes(field) ? 'text-blue-900 font-medium' : 'text-gray-700'
                      }`}>{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {fields.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              Selected Fields ({fields.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {fields.map((field) => (
                <span
                  key={field}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm"
                >
                  {field}
                  <button
                    type="button"
                    onClick={() => setFields(fields.filter(f => f !== field))}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-600 hover:bg-purple-200 hover:text-purple-800 transition-colors"
                    aria-label={`Remove ${field}`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          Language
          <InfoIcon tooltip="Select a language to filter search results. The system will use the appropriate language code for the API." />
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm bg-white"
        >
          {LANGUAGE_MAP.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
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
