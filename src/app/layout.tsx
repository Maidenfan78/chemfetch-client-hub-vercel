// src/app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Sidebar } from '@/components/sidebar';
import { TopNav } from '@/components/top-nav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'ChemFetch Client Hub - Chemical Safety Management Dashboard',
  description:
    'Professional chemical register dashboard for clients. Manage Safety Data Sheets, chemical inventory, and compliance tracking.',
  keywords: 'chemical safety, SDS management, chemical register, safety data sheets, compliance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧪</text></svg>"
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen bg-chemfetch-bg-secondary text-chemfetch-text-primary">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <TopNav />
              <main className="p-6 flex-1">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
