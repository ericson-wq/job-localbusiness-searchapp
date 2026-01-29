# Job Search & Local Business Search Application

A modern web application for GTM engineers to search for jobs and local businesses using RapidAPI, with CSV export and Clay.com webhook integration.

## Features

### 🔍 Dual Search Capabilities
- **Job Search**: Search for companies that are hiring for specific roles using the JSearch API
- **Local Business Search**: Find local businesses using the Local Business Data API with advanced filtering

### 🔑 API Key Management
- **Multiple API Key Support**: Manage separate API keys for job search and local business search
- **Secure Storage**: Client-side storage of RapidAPI keys in browser localStorage
- **Key Organization**: Name and organize multiple API keys for different services
- **Easy Configuration**: Simple modal interface for adding, editing, and deleting API keys

### 📊 Results Display
- **Job Results**: Clean table view showing key job information (title, company, location, employment type, apply link, country)
- **Business Results**: Comprehensive business data including name, address, phone, rating, reviews, type, status, and website
- **Detailed Views**: Click to view full details for each result
- **Pagination**: Navigate through results with 20 items per page

### 📄 Data Export
- **CSV Export**: Export both job and business search results to CSV format
- **Complete Data**: All available fields included in exports

### 🔗 Clay.com Integration
- **Webhook Support**: Send job and business data directly to Clay.com via webhook
- **Batch Processing**: Send multiple results at once
- **Custom Webhooks**: Configure webhook URLs for different use cases

### 🎨 User Experience
- **Resizable Sidebar**: Adjustable sidebar width for optimal viewing
- **Navigation Menu**: Easy switching between Job Search, Local Business Search, and Settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A RapidAPI account with access to:
  - **JSearch API** (for job search functionality)
  - **Local Business Data API** (for local business search functionality)
- (Optional) A Clay.com webhook URL for data integration

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. (Optional) Create a `.env.local` file for Clay.com webhook URL:
```env
NEXT_PUBLIC_CLAY_WEBHOOK_URL=https://your-clay-webhook-url.com/webhook
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Initial Setup

1. **Configure API Keys**:
   - Navigate to **Settings** from the sidebar menu
   - **Job Search API Keys**: Add your RapidAPI key for JSearch API
   - **Local Business API Keys**: Add your RapidAPI key for Local Business Data API
   - Each API key can be named for easy identification (e.g., "50 job search API")
   - API keys are stored securely in your browser's localStorage

### Job Search

1. **Navigate to Job Search**:
   - Click "Search Hiring companies" in the sidebar menu

2. **Search for Jobs**:
   - Fill in the search form with your criteria
   - The "query" field is required - include job title and location for best results
   - Adjust filters as needed (country, employment type, date posted, job requirements, etc.)
   - Click "Search Jobs"

3. **View Results**:
   - Results are displayed in a table format
   - Shows 20 results per page with pagination
   - Click "Apply" to open the job application link in a new tab

4. **Export Job Data**:
   - **CSV Export**: Click "Export to CSV" to download all job results
   - **Clay.com**: Click "Send to Clay" and enter your webhook URL to push job data to Clay.com

### Local Business Search

1. **Navigate to Local Business Search**:
   - Click "Search Local Businesses" in the sidebar menu

2. **Search for Businesses**:
   - Enter your search query (e.g., "coffee shops in San Francisco" or "plumbers near New York")
   - Optionally specify latitude/longitude coordinates for location-based searches
   - Adjust filters:
     - **Limit**: Maximum number of results (1-500, default: 20)
     - **Region**: ISO country code (e.g., "us", "ca")
     - **Language**: ISO language code (e.g., "en", "es")
     - **Subtypes**: Comma-separated business categories
     - **Business Status**: Filter by OPEN, CLOSED_TEMPORARILY, or CLOSED
     - **Verified**: Show only verified businesses
     - **Extract Emails and Contacts**: Enable to scrape contact information from business websites
   - Click "Search Businesses"

3. **View Results**:
   - Results show business name, address, phone, rating, reviews, type, status, and website
   - Click "View Details" to see comprehensive business information including:
     - Working hours
     - Business description
     - Contact information (emails, phones, social media)
     - Photos and additional metadata
   - Click "View on Google Maps" to open the business location

4. **Export Business Data**:
   - **CSV Export**: Click "Export to CSV" to download all business results
   - **Clay.com**: Click "Send to Clay" and enter your webhook URL to push business data to Clay.com

## Data Fields

### Job Search Fields

The application displays and exports the following key fields for each job:

- `job_title` - Job position title
- `employer_name` - Company name
- `employer_website` - Company website domain
- `job_employment_type` - Employment type (Full-time, Part-time, etc.)
- `job_apply_link` - Direct link to apply for the job
- `job_country` - Country code (e.g., "US", "CA")

### Local Business Search Fields

The application displays and exports comprehensive business information including:

**Core Fields:**
- `business_id` - Unique business identifier
- `name` - Business name
- `full_address` - Complete address
- `phone_number` - Contact phone number
- `website` - Business website URL
- `rating` - Google rating (0-5)
- `review_count` - Number of reviews
- `type` - Primary business type
- `subtypes` - Business categories/subtypes
- `business_status` - Current status (OPEN, CLOSED_TEMPORARILY, CLOSED)
- `verified` - Verification status

**Location Fields:**
- `latitude` / `longitude` - GPS coordinates
- `city`, `state`, `country`, `zipcode` - Address components
- `district` - Business district

**Additional Fields:**
- `opening_status` - Current opening status
- `working_hours` - Operating hours by day
- `place_link` - Google Maps link
- `reviews_link` - Link to reviews
- `emails_and_contacts` - Scraped emails, phones, and social media links (when enabled)
- `about` - Business description and details
- `photos_sample` - Sample business photos

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**: 
  - JSearch API via RapidAPI (Job Search)
  - Local Business Data API via RapidAPI (Business Search)

## Project Structure

```
job-search-app/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                     # Main page with routing
│   ├── globals.css                   # Global styles
│   └── api/
│       └── clay-webhook-businesses/  # API route for business webhooks
├── components/
│   ├── Sidebar.tsx                   # Navigation sidebar with resizable handle
│   ├── SettingsView.tsx              # Settings page with tabs
│   ├── SearchSection.tsx             # Job search form
│   ├── LocalBusinessSearchSection.tsx # Business search form
│   ├── ResultsDisplay.tsx            # Job results table
│   ├── LocalBusinessResultsDisplay.tsx # Business results table
│   ├── ApiKeySection.tsx             # Job API key management
│   ├── LocalBusinessApiKeySection.tsx # Business API key management
│   ├── AddApiKeyModal.tsx            # Add API key modal
│   ├── EditApiKeyModal.tsx           # Edit API key modal
│   ├── DeleteApiKeyModal.tsx         # Delete API key confirmation
│   ├── ClayWebhookModal.tsx          # Clay webhook for jobs
│   ├── LocalBusinessClayWebhookModal.tsx # Clay webhook for businesses
│   ├── LoadingSpinner.tsx            # Loading indicator
│   └── ResizableHandle.tsx           # Sidebar resize functionality
├── lib/
│   ├── api-keys-storage.ts           # Multi-key storage utilities
│   ├── jsearch-api.ts                # Job search API client
│   ├── local-business-api.ts         # Business search API client
│   ├── csv-export.ts                 # CSV export utilities
│   └── clay-webhook.ts               # Clay.com integration
└── types/
    ├── api-key.ts                    # API key type definitions
    ├── job.ts                        # Job type definitions
    └── local-business.ts             # Business type definitions
```

## Security Notes

- API keys are stored locally in your browser's localStorage
- API keys are never sent to any server except RapidAPI
- Each team member can use their own API keys
- The application runs entirely client-side (no backend required)
- Multiple API keys can be managed separately for different services
- API keys can be easily added, edited, or deleted from Settings

## License

This project is for internal use by GTM engineers.
