// API keys storage utilities for managing multiple API keys with metadata

import { ApiKey } from '@/types/api-key';

const API_KEYS_STORAGE_KEY = 'rapidapi_keys';

/**
 * Validates that an API key has a reasonable format
 */
export function validateApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }
  return key.trim().length >= 20;
}

/**
 * Generates a unique ID for an API key
 */
function generateId(): string {
  return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets all API keys from localStorage
 */
export function getAllApiKeys(): ApiKey[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Error retrieving API keys:', error);
  }
  return [];
}

/**
 * Saves all API keys to localStorage
 */
function saveAllApiKeys(keys: ApiKey[]): boolean {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
      return true;
    }
  } catch (error) {
    console.error('Error saving API keys:', error);
  }
  return false;
}

/**
 * Adds a new API key
 */
export function addApiKey(keyData: Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt' | 'creditsUsed'>): ApiKey | null {
  if (!validateApiKey(keyData.apiKey)) {
    return null;
  }

  const keys = getAllApiKeys();
  const newKey: ApiKey = {
    ...keyData,
    id: generateId(),
    creditsUsed: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  keys.push(newKey);
  if (saveAllApiKeys(keys)) {
    return newKey;
  }
  return null;
}

/**
 * Updates an existing API key
 */
export function updateApiKey(id: string, updates: Partial<Omit<ApiKey, 'id' | 'createdAt'>>): ApiKey | null {
  const keys = getAllApiKeys();
  const index = keys.findIndex(k => k.id === id);
  
  if (index === -1) {
    return null;
  }

  // If API key is being updated, validate it (unless it's empty, which means keep current)
  if (updates.apiKey !== undefined && updates.apiKey.trim() !== '') {
    if (!validateApiKey(updates.apiKey)) {
      return null;
    }
  } else if (updates.apiKey === '') {
    // Empty string means keep current key
    delete updates.apiKey;
  }

  keys[index] = {
    ...keys[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (saveAllApiKeys(keys)) {
    return keys[index];
  }
  return null;
}

/**
 * Deletes an API key
 */
export function deleteApiKey(id: string): boolean {
  const keys = getAllApiKeys();
  const filtered = keys.filter(k => k.id !== id);
  
  if (filtered.length === keys.length) {
    return false; // Key not found
  }

  return saveAllApiKeys(filtered);
}

/**
 * Gets a single API key by ID
 */
export function getApiKeyById(id: string): ApiKey | null {
  const keys = getAllApiKeys();
  return keys.find(k => k.id === id) || null;
}

/**
 * Gets the first active API key (for backward compatibility)
 */
export function getApiKey(): string | null {
  const keys = getAllApiKeys();
  const activeKey = keys.find(k => k.isActive);
  return activeKey ? activeKey.apiKey : null;
}

/**
 * Checks if any API key is stored
 */
export function hasApiKey(): boolean {
  const keys = getAllApiKeys();
  return keys.length > 0 && keys.some(k => k.isActive);
}

/**
 * Gets API keys filtered by service type
 */
export function getApiKeysByServiceType(serviceType: 'job-search' | 'local-business'): ApiKey[] {
  const keys = getAllApiKeys();
  return keys.filter(key => {
    // If serviceType is set, use it; otherwise infer from host
    if (key.serviceType) {
      return key.serviceType === serviceType;
    }
    // Fallback to host-based detection
    if (serviceType === 'local-business') {
      return key.host.includes('local-business-data') || key.host.includes('local-business');
    }
    // Default to job-search for other hosts
    return !key.host.includes('local-business-data') && !key.host.includes('local-business');
  });
}

/**
 * Gets the first active API key for a specific service type
 */
export function getActiveApiKeyByServiceType(serviceType: 'job-search' | 'local-business'): ApiKey | null {
  const keys = getApiKeysByServiceType(serviceType);
  return keys.find(k => k.isActive) || null;
}

/**
 * Checks if an API key exists for a specific service type
 */
export function hasApiKeyForService(serviceType: 'job-search' | 'local-business'): boolean {
  const keys = getApiKeysByServiceType(serviceType);
  return keys.length > 0 && keys.some(k => k.isActive);
}

/**
 * Updates credits used for an API key (for tracking usage)
 */
export function updateCreditsUsed(id: string, creditsUsed: number): boolean {
  const keys = getAllApiKeys();
  const index = keys.findIndex(k => k.id === id);
  
  if (index === -1) {
    return false;
  }

  keys[index].creditsUsed = Math.max(0, creditsUsed);
  keys[index].updatedAt = new Date().toISOString();
  
  return saveAllApiKeys(keys);
}

/**
 * Migrates old single API key format to new multi-key format
 */
export function migrateOldApiKey(): void {
  try {
    if (typeof window !== 'undefined') {
      const oldKey = localStorage.getItem('rapidapi_key');
      if (oldKey && validateApiKey(oldKey)) {
        const existingKeys = getAllApiKeys();
        // Only migrate if no keys exist yet
        if (existingKeys.length === 0) {
          addApiKey({
            name: 'Default API Key',
            host: 'jsearch.p.rapidapi.com',
            apiKey: oldKey,
            creditsPerMonth: 10000,
            rpmLimit: 10,
            isActive: true,
          });
          // Remove old key
          localStorage.removeItem('rapidapi_key');
        }
      }
    }
  } catch (error) {
    console.error('Error migrating old API key:', error);
  }
}
