import { getActiveApiKeyByServiceType, hasApiKeyForService } from './api-keys-storage';
import { LocalBusinessSearchResponse, LocalBusinessSearchParams } from '@/types/local-business';

const DEFAULT_LOCAL_BUSINESS_HOST = 'local-business-data.p.rapidapi.com';
const DEFAULT_LOCAL_BUSINESS_BASE_URL = 'https://local-business-data.p.rapidapi.com';

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
function buildQueryParams(params: LocalBusinessSearchParams): string {
  const queryParams = new URLSearchParams();
  
  queryParams.append('query', params.query);
  
  if (params.lat !== undefined) {
    queryParams.append('lat', params.lat.toString());
  }
  
  if (params.lng !== undefined) {
    queryParams.append('lng', params.lng.toString());
  }
  
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params.region) {
    queryParams.append('region', params.region);
  }
  
  if (params.language) {
    queryParams.append('language', params.language);
  }
  
  if (params.extract_emails_and_contacts !== undefined) {
    queryParams.append('extract_emails_and_contacts', params.extract_emails_and_contacts.toString());
  }
  
  if (params.fields) {
    queryParams.append('fields', params.fields);
  }
  
  if (params.subtypes) {
    queryParams.append('subtypes', params.subtypes);
  }
  
  if (params.business_status) {
    queryParams.append('business_status', params.business_status);
  }
  
  if (params.verified !== undefined) {
    queryParams.append('verified', params.verified.toString());
  }
  
  if (params.zoom) {
    queryParams.append('zoom', params.zoom);
  }
  
  return queryParams.toString();
}

/**
 * Gets the active API key for local business search
 */
function getActiveLocalBusinessApiKey(): { key: string; host: string } | null {
  const activeKey = getActiveApiKeyByServiceType('local-business');
  
  if (!activeKey) {
    return null;
  }

  return {
    key: activeKey.apiKey,
    host: activeKey.host || DEFAULT_LOCAL_BUSINESS_HOST,
  };
}

/**
 * Searches for local businesses using the RapidAPI Local Business Data API
 */
export async function searchLocalBusinesses(params: LocalBusinessSearchParams): Promise<LocalBusinessSearchResponse> {
  // Validate API key exists
  if (!hasApiKeyForService('local-business')) {
    throw new ApiKeyError('Local Business API key is not configured. Please add your RapidAPI key in Settings.');
  }

  const apiKeyData = getActiveLocalBusinessApiKey();
  if (!apiKeyData) {
    throw new ApiKeyError('No active Local Business API key found. Please activate an API key.');
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
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // If parsing fails, use the default message
      }

      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        throw new ApiKeyError('Invalid API key. Please check your RapidAPI key.');
      } else if (response.status === 429) {
        throw new ApiError('Rate limit exceeded. Please try again later.', 429);
      } else {
        throw new ApiError(errorMessage, response.status);
      }
    }

    const data: LocalBusinessSearchResponse = await response.json();
    
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
