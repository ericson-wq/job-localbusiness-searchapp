import { JobDisplay } from '@/types/job';
import { LocalBusinessDisplay } from '@/types/local-business';

export interface ClayWebhookResult {
  success: boolean;
  message: string;
  statusCode?: number;
  successCount?: number;
  failureCount?: number;
  results?: Array<{
    job_title?: string;
    business_name?: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Sends job data to Clay.com webhook via Next.js API route (to avoid CORS issues)
 */
export async function sendToClay(
  jobs: JobDisplay[],
  webhookUrl: string
): Promise<ClayWebhookResult> {
  if (jobs.length === 0) {
    return {
      success: false,
      message: 'No data to send',
    };
  }

  if (!webhookUrl || !webhookUrl.trim()) {
    return {
      success: false,
      message: 'Webhook URL is required',
    };
  }

  try {
    // Call our Next.js API route instead of Clay.com directly
    // This avoids CORS issues when running on localhost
    const response = await fetch('/api/clay-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobs,
        webhookUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        message: `Request failed: ${response.status} ${response.statusText}`,
      }));
      return {
        success: false,
        message: errorData.message || `Request failed: ${response.status} ${response.statusText}`,
        statusCode: response.status,
      };
    }

    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      statusCode: result.statusCode,
      successCount: result.successCount,
      failureCount: result.failureCount,
      results: result.results,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your internet connection and webhook URL.',
      };
    }

    return {
      success: false,
      message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Sends local business data to Clay.com webhook via Next.js API route (to avoid CORS issues)
 */
export async function sendLocalBusinessesToClay(
  businesses: LocalBusinessDisplay[],
  webhookUrl: string
): Promise<ClayWebhookResult> {
  if (businesses.length === 0) {
    return {
      success: false,
      message: 'No data to send',
    };
  }

  if (!webhookUrl || !webhookUrl.trim()) {
    return {
      success: false,
      message: 'Webhook URL is required',
    };
  }

  try {
    // Call our Next.js API route instead of Clay.com directly
    // This avoids CORS issues when running on localhost
    const response = await fetch('/api/clay-webhook-businesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businesses,
        webhookUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        message: `Request failed: ${response.status} ${response.statusText}`,
      }));
      return {
        success: false,
        message: errorData.message || `Request failed: ${response.status} ${response.statusText}`,
        statusCode: response.status,
      };
    }

    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      statusCode: result.statusCode,
      successCount: result.successCount,
      failureCount: result.failureCount,
      results: result.results,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your internet connection and webhook URL.',
      };
    }

    return {
      success: false,
      message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Gets the Clay webhook URL from environment variable or returns null
 */
export function getClayWebhookUrl(): string | null {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_CLAY_WEBHOOK_URL || null;
  }
  return null;
}
