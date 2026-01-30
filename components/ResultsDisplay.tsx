'use client';

import { useState, useMemo } from 'react';
import { JobDisplay } from '@/types/job';
import { downloadCsv } from '@/lib/csv-export';
import ClayWebhookModal from './ClayWebhookModal';

interface ResultsDisplayProps {
  jobs: JobDisplay[];
  totalResults?: number;
  onExport?: (jobs: JobDisplay[]) => void;
}

const RESULTS_PER_PAGE = 20;

export default function ResultsDisplay({ jobs, totalResults, onExport }: ResultsDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isClayModalOpen, setIsClayModalOpen] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [selectedJobDescription, setSelectedJobDescription] = useState<{ job: JobDisplay; index: number } | null>(null);
  const [selectedJobJson, setSelectedJobJson] = useState<JobDisplay | null>(null);
  const [failedLogos, setFailedLogos] = useState<Set<number>>(new Set());
  const [selectedJobIndices, setSelectedJobIndices] = useState<Set<number>>(new Set());

  const totalPages = Math.ceil(jobs.length / RESULTS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    return jobs.slice(startIndex, endIndex);
  }, [jobs, currentPage]);

  // Get selected jobs based on indices
  const selectedJobs = useMemo(() => {
    return jobs.filter((_, index) => selectedJobIndices.has(index));
  }, [jobs, selectedJobIndices]);

  // Check if all jobs on current page are selected
  const areAllPageJobsSelected = useMemo(() => {
    if (paginatedJobs.length === 0) return false;
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    return paginatedJobs.every((_, index) => selectedJobIndices.has(startIndex + index));
  }, [paginatedJobs, selectedJobIndices, currentPage]);

  // Check if some (but not all) jobs on current page are selected
  const areSomePageJobsSelected = useMemo(() => {
    if (paginatedJobs.length === 0) return false;
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const selectedCount = paginatedJobs.filter((_, index) => selectedJobIndices.has(startIndex + index)).length;
    return selectedCount > 0 && selectedCount < paginatedJobs.length;
  }, [paginatedJobs, selectedJobIndices, currentPage]);

  // Handle individual checkbox toggle
  const toggleJobSelection = (index: number) => {
    setSelectedJobIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Handle select all on current page
  const toggleSelectAllPage = () => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + paginatedJobs.length;
    
    setSelectedJobIndices(prev => {
      const newSet = new Set(prev);
      const allSelected = paginatedJobs.every((_, idx) => newSet.has(startIndex + idx));
      
      if (allSelected) {
        // Deselect all on current page
        for (let i = startIndex; i < endIndex; i++) {
          newSet.delete(i);
        }
      } else {
        // Select all on current page
        for (let i = startIndex; i < endIndex; i++) {
          newSet.add(i);
        }
      }
      return newSet;
    });
  };

  // Handle select all jobs
  const toggleSelectAll = () => {
    const allSelected = jobs.every((_, index) => selectedJobIndices.has(index));
    
    if (allSelected) {
      setSelectedJobIndices(new Set());
    } else {
      setSelectedJobIndices(new Set(jobs.map((_, index) => index)));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString; // Return original string if parsing fails
    }
  };

  const openDescriptionModal = (job: JobDisplay, index: number) => {
    setSelectedJobDescription({ job, index });
  };

  const closeDescriptionModal = () => {
    setSelectedJobDescription(null);
  };

  const openJsonModal = (job: JobDisplay) => {
    setSelectedJobJson(job);
  };

  const closeJsonModal = () => {
    setSelectedJobJson(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCsvExport = () => {
    if (selectedJobs.length === 0) {
      return;
    }

    setIsExportingCsv(true);
    try {
      downloadCsv(selectedJobs);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setIsExportingCsv(false);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No results found. Try adjusting your search parameters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {paginatedJobs.length} of {jobs.length} results
            {totalResults !== undefined && totalResults > jobs.length && (
              <span> (Total: {totalResults})</span>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 font-medium">
              {selectedJobs.length > 0 ? (
                <span className="text-blue-600 font-semibold">{selectedJobs.length}</span>
              ) : (
                <span className="text-gray-500">0</span>
              )}{' '}
              of {jobs.length} selected
            </span>
            {selectedJobs.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {selectedJobs.length === jobs.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCsvExport}
              disabled={isExportingCsv || selectedJobs.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export to CSV
                </>
              )}
            </button>
            <button
              onClick={() => setIsClayModalOpen(true)}
              disabled={selectedJobs.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Send to Clay
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={areAllPageJobsSelected && paginatedJobs.length > 0}
                      ref={(input) => {
                        if (input) input.indeterminate = areSomePageJobsSelected;
                      }}
                      onChange={toggleSelectAllPage}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      aria-label="Select all jobs on this page"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employer Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publisher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  JSON
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedJobs.map((job, index) => {
                const absoluteIndex = (currentPage - 1) * RESULTS_PER_PAGE + index;
                const sourceLinkIsLong = (job.job_apply_link?.length || 0) > 40;
                const isSelected = selectedJobIndices.has(absoluteIndex);

                return (
                  <tr key={`${job.job_title}-${index}`} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleJobSelection(absoluteIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        aria-label={`Select ${job.job_title} at ${job.employer_name}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.employer_logo && !failedLogos.has(absoluteIndex) ? (
                        <img 
                          src={job.employer_logo} 
                          alt={job.employer_name}
                          className="h-10 w-10 rounded object-contain bg-gray-50 border border-gray-200 p-1"
                          onError={() => {
                            setFailedLogos(prev => new Set(prev).add(absoluteIndex));
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center border border-gray-300">
                          <span className="text-xs text-gray-500 font-medium">
                            {job.employer_name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {job.job_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.employer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.employer_website ? (
                        <a
                          href={job.employer_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          title={job.employer_website}
                        >
                          <span className="truncate max-w-[150px]">{job.employer_website}</span>
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.job_publisher}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.job_employment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.job_country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(job.job_posted_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDescriptionModal(job, absoluteIndex)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <span>View Description</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={job.job_apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        title={job.job_apply_link}
                      >
                        {sourceLinkIsLong ? (
                          <>
                            <span className="truncate max-w-[120px]">Source</span>
                            <svg className="ml-1 w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </>
                        ) : (
                          <span className="truncate max-w-[200px]">{job.job_apply_link}</span>
                        )}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openJsonModal(job)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <span>View JSON</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Clay Webhook Modal */}
      <ClayWebhookModal
        isOpen={isClayModalOpen}
        onClose={() => setIsClayModalOpen(false)}
        jobs={selectedJobs}
      />

      {/* Job Description Modal - Full Screen */}
      {selectedJobDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  {selectedJobDescription.job.job_title}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedJobDescription.job.employer_name} • {selectedJobDescription.job.job_publisher}
                </p>
              </div>
              <button
                onClick={closeDescriptionModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Description
                </h3>
                <div className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedJobDescription.job.job_description}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <a
                href={selectedJobDescription.job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <span>View Source</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={closeDescriptionModal}
                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Modal - Full Screen */}
      {selectedJobJson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  JSON Data
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedJobJson.job_title} • {selectedJobJson.employer_name}
                </p>
              </div>
              <button
                onClick={closeJsonModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Full JSON Data
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(selectedJobJson, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedJobJson, null, 2));
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy JSON
              </button>
              <div className="flex items-center gap-3">
                <a
                  href={selectedJobJson.job_apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>View Source</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={closeJsonModal}
                  className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
