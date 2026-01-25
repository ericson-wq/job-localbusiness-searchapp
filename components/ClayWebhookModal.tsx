'use client';

import { useState } from 'react';
import { JobDisplay } from '@/types/job';
import { sendToClay, getClayWebhookUrl } from '@/lib/clay-webhook';

interface ClayWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobDisplay[];
}

export default function ClayWebhookModal({ isOpen, onClose, jobs }: ClayWebhookModalProps) {
  const [clayUrl, setClayUrl] = useState(getClayWebhookUrl() || '');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    setError('');
    setSuccess('');

    if (jobs.length === 0) {
      setError('No results to send');
      return;
    }

    const webhookUrl = clayUrl.trim();
    if (!webhookUrl) {
      setError('Please enter a Clay.com webhook URL');
      return;
    }

    setIsSending(true);
    try {
      const result = await sendToClay(jobs, webhookUrl);
      if (result.success) {
        // Show detailed success message
        let message = result.message;
        if (result.successCount !== undefined && result.failureCount !== undefined) {
          if (result.failureCount > 0) {
            message = `${result.successCount} sent successfully, ${result.failureCount} failed. ${result.message}`;
          }
        }
        setSuccess(message);
        // Close modal after 3 seconds on success (longer if there were failures)
        setTimeout(() => {
          onClose();
          setSuccess('');
          setClayUrl(getClayWebhookUrl() || '');
        }, result.failureCount && result.failureCount > 0 ? 5000 : 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Failed to send to Clay: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setError('');
      setSuccess('');
      setClayUrl(getClayWebhookUrl() || '');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Send to Clay</h2>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Enter your Clay.com webhook URL to send {jobs.length} job{jobs.length !== 1 ? 's' : ''} directly to Clay.
            <span className="block mt-1 text-xs text-gray-500">
              Each job will be sent as a separate webhook request (one job = one row in Clay).
            </span>
          </p>

          <div>
            <label htmlFor="clay-webhook-url" className="block text-sm font-medium text-gray-700 mb-1">
              Clay.com Webhook URL <span className="text-red-500">*</span>
            </label>
            <input
              id="clay-webhook-url"
              type="url"
              value={clayUrl}
              onChange={(e) => setClayUrl(e.target.value)}
              placeholder="https://api.clay.com/webhook/..."
              disabled={isSending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">{success}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSending}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !clayUrl.trim() || jobs.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
          >
            {isSending ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send to Clay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
