# Job Search Web Application

A modern web application for GTM engineers to search for jobs using the JSearch API, with CSV export and Clay.com webhook integration.

## Features

- 🔑 **API Key Management**: Secure client-side storage of RapidAPI keys
- 🔍 **Advanced Job Search**: Search with multiple filters (location, employment type, date posted, etc.)
- 📊 **Results Display**: Clean table view showing 6 key fields per job
- 📄 **CSV Export**: Export search results to CSV format
- 🔗 **Clay.com Integration**: Send job data directly to Clay.com via webhook
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A RapidAPI account with access to the JSearch API
- (Optional) A Clay.com webhook URL

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

1. **Configure API Key**: 
   - Enter your RapidAPI key in the API Key Configuration section at the top
   - Click "Save API Key" to store it locally in your browser

2. **Search for Jobs**:
   - Fill in the search form with your criteria
   - The "query" field is required - include job title and location for best results
   - Adjust filters as needed (country, employment type, date posted, etc.)
   - Click "Search Jobs"

3. **View Results**:
   - Results are displayed in a table format
   - Shows 20 results per page with pagination
   - Click "Apply" to open the job application link in a new tab

4. **Export Data**:
   - **CSV Export**: Click "Export to CSV" to download all results
   - **Clay.com**: Enter your webhook URL and click "Send to Clay" to push data to Clay.com

## Data Fields

The application displays and exports the following 6 fields for each job:

- `job_title` - Job position title
- `employer_name` - Company name
- `employer_website` - Company website domain
- `job_employment_type` - Employment type (Full-time, Part-time, etc.)
- `job_apply_link` - Direct link to apply for the job
- `job_country` - Country code (e.g., "US", "CA")

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: JSearch API via RapidAPI

## Project Structure

```
job-search-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── ApiKeyInput.tsx      # API key management
│   ├── SearchForm.tsx        # Search form
│   ├── ResultsDisplay.tsx   # Results table
│   ├── ExportButtons.tsx    # Export functionality
│   └── LoadingSpinner.tsx    # Loading indicator
├── lib/
│   ├── api-key-storage.ts   # localStorage utilities
│   ├── jsearch-api.ts       # API client
│   ├── csv-export.ts        # CSV export utility
│   └── clay-webhook.ts      # Clay.com integration
└── types/
    └── job.ts               # TypeScript types
```

## Security Notes

- API keys are stored locally in your browser's localStorage
- API keys are never sent to any server except RapidAPI
- Each team member can use their own API key
- The application runs entirely client-side (no backend required)

## License

This project is for internal use by GTM engineers.
