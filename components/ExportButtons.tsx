'use client';

import { useState } from 'react';
import { JobDisplay } from '@/types/job';
import { downloadCsv } from '@/lib/csv-export';
import { sendToClay, getClayWebhookUrl } from '@/lib/clay-webhook';

interface ExportButtonsProps {
  jobs: JobDisplay[];
  clayWebhookUrl?: string;
}

export default function ExportButtons({ jobs, clayWebhookUrl }: ExportButtonsProps) {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isSendingToClay, setIsSendingToClay] = useState(false);
  const [clayUrl, setClayUrl] = useState(clayWebhookUrl || getClayWebhookUrl() || '');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCsvExport = () => {
    if (jobs.length === 0) {
      showNotification('error', 'No results to export');
      return;
    }

    setIsExportingCsv(true);
    try {
      downloadCsv(jobs);
      showNotification('success', `Exported ${jobs.length} job(s) to CSV`);
    } catch (error) {
      showNotification('error', `Failed to export CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleSendToClay = async () => {
    if (jobs.length === 0) {
      showNotification('error', 'No results to send');
      return;
    }

    const webhookUrl = clayUrl.trim();
    if (!webhookUrl) {
      showNotification('error', 'Please enter a Clay.com webhook URL');
      return;
    }

    setIsSendingToClay(true);
    try {
      const result = await sendToClay(jobs, webhookUrl);
      if (result.success) {
        showNotification('success', result.message);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', `Failed to send to Clay: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSendingToClay(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
      
      <div className="space-y-4">
        {/* CSV Export */}
        <div>
          <button
            onClick={handleCsvExport}
            disabled={isExportingCsv || jobs.length === 0}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            {isExportingCsv ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to CSV
              </>
            )}
          </button>
        </div>

        {/* Clay.com Webhook */}
        <div className="space-y-2">
          <label htmlFor="clay-webhook-url" className="block text-sm font-medium text-gray-700">
            Clay.com Webhook URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="clay-webhook-url"
              type="url"
              value={clayUrl}
              onChange={(e) => setClayUrl(e.target.value)}
              placeholder="https://api.clay.com/webhook/..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendToClay}
              disabled={isSendingToClay || jobs.length === 0 || !clayUrl.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              {isSendingToClay ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Send to Clay
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Enter your Clay.com webhook URL to send job data directly
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mt-4 p-3 rounded-md ${
            notification.type === 'success'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`text-sm ${
              notification.type === 'success'
                ? 'text-blue-800'
                : 'text-red-800'
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
}
