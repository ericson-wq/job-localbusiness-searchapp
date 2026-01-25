import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Search App - GTM Engineers',
  description: 'Search for jobs using the JSearch API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
