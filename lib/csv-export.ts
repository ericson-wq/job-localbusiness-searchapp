import { JobDisplay } from '@/types/job';

/**
 * Escapes a CSV field value
 */
function escapeCsvField(field: string | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringValue = String(field);
  
  // If the field contains comma, quote, or newline, wrap it in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Converts an array of JobDisplay objects to CSV format
 */
export function jobsToCsv(jobs: JobDisplay[]): string {
  if (jobs.length === 0) {
    return '';
  }

  // CSV Header
  const headers = [
    'Job Title',
    'Employer Name',
    'Employer Logo',
    'Employer Website',
    'Job Publisher',
    'Employment Type',
    'Country',
    'Job Posted At',
    'Job Description',
    'Source Link'
  ];

  // Create CSV rows
  const rows = jobs.map(job => [
    escapeCsvField(job.job_title),
    escapeCsvField(job.employer_name),
    escapeCsvField(job.employer_logo),
    escapeCsvField(job.employer_website),
    escapeCsvField(job.job_publisher),
    escapeCsvField(job.job_employment_type),
    escapeCsvField(job.job_country),
    escapeCsvField(job.job_posted_at),
    escapeCsvField(job.job_description),
    escapeCsvField(job.job_apply_link),
  ]);

  // Combine header and rows
  const csvLines = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ];

  return csvLines.join('\n');
}

/**
 * Downloads a CSV file with the given jobs data
 */
export function downloadCsv(jobs: JobDisplay[], filename?: string): void {
  if (jobs.length === 0) {
    alert('No data to export');
    return;
  }

  const csvContent = jobsToCsv(jobs);
  
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Generate filename with timestamp if not provided
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const finalFilename = filename || `job-search-results-${timestamp}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}
