// API key storage utilities - backward compatibility wrapper
// This file maintains backward compatibility while using the new multi-key storage system

import {
  getAllApiKeys,
  getApiKey as getApiKeyNew,
  hasApiKey as hasApiKeyNew,
  addApiKey,
  updateApiKey,
  validateApiKey as validateApiKeyNew,
  migrateOldApiKey,
} from './api-keys-storage';

// Migrate on import
if (typeof window !== 'undefined') {
  migrateOldApiKey();
}

/**
 * Validates that an API key has a reasonable format
 */
export function validateApiKey(key: string): boolean {
  return validateApiKeyNew(key);
}

/**
 * Saves the API key to localStorage (creates a new key or updates the first active one)
 * @deprecated Use the new API keys management system instead
 */
export function saveApiKey(key: string): boolean {
  if (!validateApiKey(key)) {
    return false;
  }
  
  const keys = getAllApiKeys();
  // If no keys exist, create a new one
  if (keys.length === 0) {
    const newKey = addApiKey({
      name: 'Default API Key',
      host: 'jsearch.p.rapidapi.com',
      apiKey: key.trim(),
      creditsPerMonth: 10000,
      isActive: true,
    });
    return newKey !== null;
  }
  
  // Otherwise, update the first active key or create a new one
  const activeKey = keys.find(k => k.isActive);
  if (activeKey) {
    // Update existing active key
    return updateApiKey(activeKey.id, { apiKey: key.trim() }) !== null;
  } else {
    // Create new key if none are active
    const newKey = addApiKey({
      name: 'Default API Key',
      host: 'jsearch.p.rapidapi.com',
      apiKey: key.trim(),
      creditsPerMonth: 10000,
      isActive: true,
    });
    return newKey !== null;
  }
}

/**
 * Retrieves the API key from localStorage (gets first active key)
 */
export function getApiKey(): string | null {
  return getApiKeyNew();
}

/**
 * Checks if an API key is stored
 */
export function hasApiKey(): boolean {
  return hasApiKeyNew();
}

/**
 * Clears the API key from localStorage (deactivates all keys)
 * @deprecated Use the new API keys management system instead
 */
export function clearApiKey(): void {
  const keys = getAllApiKeys();
  // Deactivate all keys instead of deleting
  keys.forEach(key => {
    updateApiKey(key.id, { isActive: false });
  });
}
