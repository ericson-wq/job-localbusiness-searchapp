import { JobDisplay } from '@/types/job';
import { LocalBusinessDisplay } from '@/types/local-business';

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

/**
 * Converts an array of LocalBusinessDisplay objects to CSV format
 */
export function localBusinessesToCsv(businesses: LocalBusinessDisplay[]): string {
  if (businesses.length === 0) {
    return '';
  }

  // CSV Header
  const headers = [
    'Name',
    'Address',
    'Full Address',
    'Phone Number',
    'Rating',
    'Review Count',
    'Type',
    'Subtypes',
    'Business Status',
    'Website',
    'Verified',
    'City',
    'State',
    'Country',
    'Zipcode',
    'District',
    'Opening Status',
    'Place Link',
    'Reviews Link',
  ];

  // Create CSV rows
  const rows = businesses.map(business => [
    escapeCsvField(business.name),
    escapeCsvField(business.address),
    escapeCsvField(business.full_address),
    escapeCsvField(business.phone_number),
    escapeCsvField(business.rating.toString()),
    escapeCsvField(business.review_count.toString()),
    escapeCsvField(business.type),
    escapeCsvField(business.subtypes?.join('; ') || ''),
    escapeCsvField(business.business_status),
    escapeCsvField(business.website),
    escapeCsvField(business.verified ? 'Yes' : 'No'),
    escapeCsvField(business.city),
    escapeCsvField(business.state),
    escapeCsvField(business.country),
    escapeCsvField(business.zipcode),
    escapeCsvField(business.district),
    escapeCsvField(business.opening_status),
    escapeCsvField(business.place_link),
    escapeCsvField(business.reviews_link),
  ]);

  // Combine header and rows
  const csvLines = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ];

  return csvLines.join('\n');
}

/**
 * Downloads a CSV file with the given local businesses data
 */
export function downloadLocalBusinessCsv(businesses: LocalBusinessDisplay[], filename?: string): void {
  if (businesses.length === 0) {
    alert('No data to export');
    return;
  }

  const csvContent = localBusinessesToCsv(businesses);
  
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Generate filename with timestamp if not provided
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const finalFilename = filename || `local-business-search-results-${timestamp}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}
