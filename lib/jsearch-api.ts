import { getAllApiKeys, hasApiKey } from './api-keys-storage';
import { JobSearchResponse, JobSearchParameters } from '@/types/job';

const DEFAULT_API_HOST = 'jsearch.p.rapidapi.com';
const DEFAULT_API_BASE_URL = 'https://jsearch.p.rapidapi.com';

export interface SearchJobsParams {
  query: string;
  page?: number;
  num_pages?: number;
  country?: string;
  language?: string;
  date_posted?: 'all' | 'today' | '3days' | 'week' | 'month';
  work_from_home?: boolean;
  employment_types?: string;
  job_requirements?: string;
  radius?: number;
  exclude_job_publishers?: string;
  fields?: string;
}

export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Builds query parameters from search params
 */
function buildQueryParams(params: SearchJobsParams): string {
  const queryParams = new URLSearchParams();
  
  queryParams.append('query', params.query);
  
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params.num_pages !== undefined) {
    queryParams.append('num_pages', params.num_pages.toString());
  }
  
  if (params.country) {
    queryParams.append('country', params.country);
  }
  
  if (params.language) {
    queryParams.append('language', params.language);
  }
  
  if (params.date_posted) {
    queryParams.append('date_posted', params.date_posted);
  }
  
  if (params.work_from_home !== undefined) {
    queryParams.append('work_from_home', params.work_from_home.toString());
  }
  
  if (params.employment_types) {
    queryParams.append('employment_types', params.employment_types);
  }
  
  if (params.job_requirements) {
    queryParams.append('job_requirements', params.job_requirements);
  }
  
  if (params.radius !== undefined) {
    queryParams.append('radius', params.radius.toString());
  }
  
  if (params.exclude_job_publishers) {
    queryParams.append('exclude_job_publishers', params.exclude_job_publishers);
  }
  
  // Only include fields parameter if explicitly provided
  // If not provided, API returns all fields by default
  if (params.fields && params.fields.trim()) {
    // Sanitize fields: remove extra whitespace, filter out empty values
    const sanitizedFields = params.fields
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)
      .join(',');
    
    if (sanitizedFields) {
      queryParams.append('fields', sanitizedFields);
      
      // Log fields being sent in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Fields parameter:', sanitizedFields);
      }
    }
  }
  
  return queryParams.toString();
}

/**
 * Gets the first active API key for API requests
 */
function getActiveApiKey(): { key: string; host: string } | null {
  const keys = getAllApiKeys();
  const activeKey = keys.find(k => k.isActive);
  
  if (!activeKey) {
    return null;
  }

  return {
    key: activeKey.apiKey,
    host: activeKey.host || DEFAULT_API_HOST,
  };
}

/**
 * Searches for jobs using the JSearch API
 */
export async function searchJobs(params: SearchJobsParams): Promise<JobSearchResponse> {
  // Validate API key exists
  if (!hasApiKey()) {
    throw new ApiKeyError('API key is not configured. Please add your RapidAPI key.');
  }

  const apiKeyData = getActiveApiKey();
  if (!apiKeyData) {
    throw new ApiKeyError('No active API key found. Please activate an API key.');
  }

  // Build URL with query parameters
  const queryString = buildQueryParams(params);
  const apiBaseUrl = apiKeyData.host.startsWith('http') 
    ? apiKeyData.host 
    : `https://${apiKeyData.host}`;
  const url = `${apiBaseUrl}/search?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKeyData.key,
        'X-RapidAPI-Host': apiKeyData.host,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed with status ${response.status}`;
      let errorDetails: any = null;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson;
        
        // Try to extract meaningful error message
        if (errorJson.message) {
          errorMessage = errorJson.message;
        } else if (errorJson.error) {
          errorMessage = typeof errorJson.error === 'string' 
            ? errorJson.error 
            : errorJson.error.message || JSON.stringify(errorJson.error);
        } else if (errorJson.errors && Array.isArray(errorJson.errors) && errorJson.errors.length > 0) {
          errorMessage = errorJson.errors.map((e: any) => e.message || e).join(', ');
        }
        
        // Log full error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            errorJson,
            url: url.split('?')[0], // Don't log full URL with API key
            params: Object.fromEntries(new URLSearchParams(queryString))
          });
        }
      } catch {
        // If parsing fails, include the raw error text
        errorMessage = errorText || errorMessage;
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error (non-JSON):', {
            status: response.status,
            statusText: response.statusText,
            errorText,
            url: url.split('?')[0]
          });
        }
      }

      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        throw new ApiKeyError('Invalid API key. Please check your RapidAPI key.');
      } else if (response.status === 429) {
        throw new ApiError('Rate limit exceeded. Please try again later.', 429);
      } else if (response.status === 400) {
        // For 400 errors, provide more context
        let enhancedMessage = errorMessage;
        
        // Check if error is related to fields parameter
        const errorLower = errorMessage.toLowerCase();
        const isFieldsError = errorLower.includes('field') || 
                             errorLower.includes('invalid') ||
                             (errorDetails && (
                               errorDetails.param === 'fields' ||
                               errorDetails.field ||
                               (typeof errorDetails === 'string' && errorDetails.toLowerCase().includes('field'))
                             ));
        
        if (isFieldsError && params.fields) {
          enhancedMessage = `${errorMessage} (Fields parameter: ${params.fields}). Some field names may not be supported by the API. Try selecting fewer fields or different fields.`;
        } else if (errorDetails) {
          enhancedMessage = errorDetails.param 
            ? `${errorMessage} (Parameter: ${errorDetails.param})`
            : errorMessage;
        }
        
        throw new ApiError(enhancedMessage, response.status);
      } else {
        throw new ApiError(errorMessage, response.status);
      }
    }

    const data: JobSearchResponse = await response.json();
    
    if (data.status !== 'OK') {
      throw new ApiError(`API returned status: ${data.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiKeyError || error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error. Please check your internet connection.');
    }
    
    throw new ApiError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
