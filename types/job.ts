// Types based on JSearch API response structure

export interface JobSearchParameters {
  query: string;
  page?: number;
  num_pages?: number;
  date_posted?: 'all' | 'today' | '3days' | 'week' | 'month';
  country?: string;
  language?: string;
  work_from_home?: boolean;
  employment_types?: string;
  job_requirements?: string;
  radius?: number;
  exclude_job_publishers?: string;
  fields?: string;
}

export interface ApplyOption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

export interface JobHighlights {
  Qualifications?: string[];
  Benefits?: string[];
  Responsibilities?: string[];
}

export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_employment_types: string[];
  job_apply_link: string;
  job_apply_is_direct: boolean;
  apply_options: ApplyOption[];
  job_description: string;
  job_is_remote: boolean;
  job_posted_at: string;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_location: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_latitude: number;
  job_longitude: number;
  job_benefits: string[] | null;
  job_google_link: string;
  job_salary: number | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string | null;
  job_highlights: JobHighlights;
  job_onet_soc: string;
  job_onet_job_zone: string;
}

export interface JobSearchResponse {
  status: string;
  request_id: string;
  parameters: JobSearchParameters;
  data: Job[];
}

// Complete type for display and export - includes all fields from Job
// Fields are optional to handle cases where API doesn't return all fields
export interface JobDisplay {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_employment_types?: string[];
  job_apply_link: string;
  job_apply_is_direct?: boolean;
  apply_options?: ApplyOption[];
  job_description: string;
  job_is_remote?: boolean;
  job_posted_at: string;
  job_posted_at_timestamp?: number;
  job_posted_at_datetime_utc?: string;
  job_location?: string;
  job_city?: string;
  job_state?: string;
  job_country: string;
  job_latitude?: number;
  job_longitude?: number;
  job_benefits?: string[] | null;
  job_google_link?: string;
  job_salary?: number | null;
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_period?: string | null;
  job_highlights?: JobHighlights;
  job_onet_soc?: string;
  job_onet_job_zone?: string;
}

// Helper function to convert Job to JobDisplay
// Handles missing fields gracefully with defaults
// Safely accesses properties that might not exist in API response
export function jobToDisplay(job: any): JobDisplay {
  // Safely extract values, handling both missing properties and null/undefined
  const safeGet = (key: string, defaultValue: any = '') => {
    return job?.[key] !== undefined && job[key] !== null ? job[key] : defaultValue;
  };

  return {
    job_id: safeGet('job_id', ''),
    job_title: safeGet('job_title', ''),
    employer_name: safeGet('employer_name', ''),
    employer_logo: safeGet('employer_logo', null),
    employer_website: safeGet('employer_website', null),
    job_publisher: safeGet('job_publisher', ''),
    job_employment_type: safeGet('job_employment_type', ''),
    job_employment_types: Array.isArray(job?.job_employment_types) ? job.job_employment_types : [],
    job_apply_link: safeGet('job_apply_link', ''),
    job_apply_is_direct: safeGet('job_apply_is_direct', false),
    apply_options: Array.isArray(job?.apply_options) ? job.apply_options : [],
    job_description: safeGet('job_description', ''),
    job_is_remote: safeGet('job_is_remote', false),
    job_posted_at: safeGet('job_posted_at', ''),
    job_posted_at_timestamp: safeGet('job_posted_at_timestamp', 0),
    job_posted_at_datetime_utc: safeGet('job_posted_at_datetime_utc', ''),
    job_location: safeGet('job_location', ''),
    job_city: safeGet('job_city', ''),
    job_state: safeGet('job_state', ''),
    job_country: safeGet('job_country', ''),
    job_latitude: typeof job?.job_latitude === 'number' ? job.job_latitude : 0,
    job_longitude: typeof job?.job_longitude === 'number' ? job.job_longitude : 0,
    job_benefits: Array.isArray(job?.job_benefits) ? job.job_benefits : null,
    job_google_link: safeGet('job_google_link', ''),
    job_salary: typeof job?.job_salary === 'number' ? job.job_salary : null,
    job_min_salary: typeof job?.job_min_salary === 'number' ? job.job_min_salary : null,
    job_max_salary: typeof job?.job_max_salary === 'number' ? job.job_max_salary : null,
    job_salary_period: safeGet('job_salary_period', null),
    job_highlights: job?.job_highlights && typeof job.job_highlights === 'object' 
      ? {
          Qualifications: Array.isArray(job.job_highlights.Qualifications) ? job.job_highlights.Qualifications : [],
          Benefits: Array.isArray(job.job_highlights.Benefits) ? job.job_highlights.Benefits : [],
          Responsibilities: Array.isArray(job.job_highlights.Responsibilities) ? job.job_highlights.Responsibilities : [],
        }
      : { Qualifications: [], Benefits: [], Responsibilities: [] },
    job_onet_soc: safeGet('job_onet_soc', ''),
    job_onet_job_zone: safeGet('job_onet_job_zone', ''),
  };
}
