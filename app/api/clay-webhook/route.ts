import { NextRequest, NextResponse } from 'next/server';
import { JobDisplay } from '@/types/job';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobs, webhookUrl } = body;

    // Validate input
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No data to send' },
        { status: 400 }
      );
    }

    if (!webhookUrl || !webhookUrl.trim()) {
      return NextResponse.json(
        { success: false, message: 'Webhook URL is required' },
        { status: 400 }
      );
    }

    // Validate webhook URL format
    try {
      new URL(webhookUrl);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid webhook URL format' },
        { status: 400 }
      );
    }

    // Send each job as a separate webhook request (one job = one row in Clay)
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const job of jobs) {
      // Prepare the JSON payload for a single job - includes all fields
      const payload = {
        job_id: job.job_id,
        job_title: job.job_title,
        employer_name: job.employer_name,
        employer_logo: job.employer_logo,
        employer_website: job.employer_website,
        job_publisher: job.job_publisher,
        job_employment_type: job.job_employment_type,
        job_employment_types: job.job_employment_types,
        job_apply_link: job.job_apply_link,
        job_apply_is_direct: job.job_apply_is_direct,
        apply_options: job.apply_options,
        job_description: job.job_description,
        job_is_remote: job.job_is_remote,
        job_posted_at: job.job_posted_at,
        job_posted_at_timestamp: job.job_posted_at_timestamp,
        job_posted_at_datetime_utc: job.job_posted_at_datetime_utc,
        job_location: job.job_location,
        job_city: job.job_city,
        job_state: job.job_state,
        job_country: job.job_country,
        job_latitude: job.job_latitude,
        job_longitude: job.job_longitude,
        job_benefits: job.job_benefits,
        job_google_link: job.job_google_link,
        job_salary: job.job_salary,
        job_min_salary: job.job_min_salary,
        job_max_salary: job.job_max_salary,
        job_salary_period: job.job_salary_period,
        job_highlights: job.job_highlights,
        job_onet_soc: job.job_onet_soc,
        job_onet_job_zone: job.job_onet_job_zone,
      };

      try {
        // Make a separate request for each job
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          results.push({
            job_title: job.job_title,
            success: false,
            error: `Status ${response.status}: ${errorText}`,
          });
          failureCount++;
        } else {
          results.push({
            job_title: job.job_title,
            success: true,
          });
          successCount++;
        }

        // Add a small delay between requests to avoid rate limiting
        if (jobs.indexOf(job) < jobs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        results.push({
          job_title: job.job_title,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        failureCount++;
      }
    }

    // Return summary
    if (failureCount === 0) {
      return NextResponse.json({
        success: true,
        message: `Successfully sent ${successCount} job(s) to Clay.com (each as a separate webhook)`,
        successCount,
        failureCount,
        results,
      });
    } else if (successCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send all ${failureCount} job(s) to Clay.com`,
          successCount,
          failureCount,
          results,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json({
        success: true,
        message: `Sent ${successCount} job(s) successfully, ${failureCount} failed`,
        successCount,
        failureCount,
        results,
      });
    }
  } catch (error) {
    console.error('Error sending to Clay webhook:', error);
    return NextResponse.json(
      {
        success: false,
        message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
