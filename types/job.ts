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

// Simplified type for display and export
export interface JobDisplay {
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_apply_link: string;
  job_country: string;
  job_description: string;
  job_posted_at: string;
}

// Helper function to convert Job to JobDisplay
export function jobToDisplay(job: Job): JobDisplay {
  return {
    job_title: job.job_title,
    employer_name: job.employer_name,
    employer_logo: job.employer_logo,
    employer_website: job.employer_website,
    job_publisher: job.job_publisher,
    job_employment_type: job.job_employment_type,
    job_apply_link: job.job_apply_link,
    job_country: job.job_country,
    job_description: job.job_description,
    job_posted_at: job.job_posted_at,
  };
}
