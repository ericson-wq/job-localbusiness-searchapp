import { NextRequest, NextResponse } from 'next/server';
import { LocalBusinessDisplay } from '@/types/local-business';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businesses, webhookUrl } = body;

    // Validate input
    if (!businesses || !Array.isArray(businesses) || businesses.length === 0) {
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

    // Send each business as a separate webhook request (one business = one row in Clay)
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const business of businesses) {
      // Prepare the JSON payload for a single business
      const payload = {
        business_name: business.name,
        address: business.full_address || business.address,
        phone_number: business.phone_number,
        rating: business.rating,
        review_count: business.review_count,
        business_type: business.type,
        subtypes: business.subtypes?.join(', ') || '',
        business_status: business.business_status,
        website: business.website,
        verified: business.verified,
        city: business.city,
        state: business.state,
        country: business.country,
        zipcode: business.zipcode,
        district: business.district,
        place_link: business.place_link,
        latitude: business.latitude,
        longitude: business.longitude,
        opening_status: business.opening_status,
      };

      try {
        // Make a separate request for each business
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
            business_name: business.name,
            success: false,
            error: `Status ${response.status}: ${errorText}`,
          });
          failureCount++;
        } else {
          results.push({
            business_name: business.name,
            success: true,
          });
          successCount++;
        }

        // Add a small delay between requests to avoid rate limiting
        if (businesses.indexOf(business) < businesses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        results.push({
          business_name: business.name,
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
        message: `Successfully sent ${successCount} business(es) to Clay.com (each as a separate webhook)`,
        successCount,
        failureCount,
        results,
      });
    } else if (successCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send all ${failureCount} business(es) to Clay.com`,
          successCount,
          failureCount,
          results,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json({
        success: true,
        message: `Sent ${successCount} business(es) successfully, ${failureCount} failed`,
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
