'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

// Mobile App Reminder Component for Client Hub
export function MobileAppReminder({ compact = false }: { compact?: boolean }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  if (compact) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium text-blue-900 text-sm">Mobile App Available</span>
          <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded font-medium">
            Testing
          </span>
        </div>

        <p className="text-blue-800 text-xs mb-2">
          Scan barcodes in the field with our Android app (closed testing).
          <a
            href="mailto:support@chemfetch.com?subject=Mobile App Testing Access Request"
            className="underline font-medium ml-1"
          >
            Request access
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6 relative shadow-sm">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-green-900">Need to scan chemicals in the field?</h4>
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
              Android Testing
            </span>
          </div>

          <p className="text-green-800 text-sm mb-3">
            Use the <strong>ChemFetch mobile app</strong> for instant barcode scanning and manual
            entry on-site. All scanned products appear here automatically with SDS processing.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Multi-format Scanning</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>OCR Recognition</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Auto SDS Discovery</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Instant Sync</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:support@chemfetch.com?subject=Mobile App Testing Access Request&body=Hi, I'd like to join the ChemFetch mobile app closed testing program for Android. Please send me the testing link."
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Request Testing Access</span>
            </a>

            <a
              href="https://chemfetch.com/help"
              target="_blank"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
            >
              <span>Mobile App Guide</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Testing Status Banner
export function TestingStatusBanner() {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div className="flex-1">
          <h5 className="font-semibold text-orange-900 text-sm">Platform Status</h5>
          <p className="text-orange-800 text-xs">
            ChemFetch is currently in active development. Mobile app in Android closed testing, web
            platform fully operational.
          </p>
        </div>
      </div>
    </div>
  );
}
