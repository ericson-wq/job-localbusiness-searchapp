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
      // Prepare the JSON payload for a single job
      const payload = {
        job_title: job.job_title,
        employer_name: job.employer_name,
        employer_website: job.employer_website,
        job_employment_type: job.job_employment_type,
        job_apply_link: job.job_apply_link,
        job_country: job.job_country,
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
