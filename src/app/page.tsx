import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase-server';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      {/* Mobile App Reminder */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
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
          <div className="flex-1">
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

      {/* Welcome Header */}
      <div className="bg-chemfetch-gradient rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">🧪</div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to ChemFetch Client Hub</h1>
            <p className="text-blue-100 text-lg">Chemical Safety Management Dashboard</p>
            <div className="mt-2 inline-block bg-yellow-400/20 text-yellow-100 px-3 py-1 rounded-lg text-sm font-medium">
              ⚠️ Testing Phase - Features may be limited
            </div>
          </div>
        </div>
        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <p className="text-lg mb-2">
            Logged in as: <span className="font-semibold">{user.email}</span>
          </p>
          <p className="text-blue-100">
            Access your chemical registers, SDS documents, and safety management tools.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Total Chemicals</h3>
            <BarChart3 size={24} className="text-chemfetch-primary" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Registered in your system</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">SDS Documents</h3>
            <FileText size={24} className="text-chemfetch-accent" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Safety data sheets available</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Scan Time</h3>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">~2-5s</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average processing time</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">OCR Accuracy</h3>
            <Users size={24} className="text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">95%+</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Text recognition accuracy</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chemical Register */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-chemfetch-primary/10 dark:bg-chemfetch-primary/20 rounded-xl flex items-center justify-center">
              <BarChart3 size={24} className="text-chemfetch-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Chemical Register
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your chemical inventory</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            View and manage all registered chemicals in your system. Track inventory, safety data,
            and compliance information.
          </p>
          <Link
            href="/watchlist"
            className="inline-flex items-center px-4 py-2 bg-chemfetch-primary text-white rounded-lg hover:bg-chemfetch-primary-dark transition-colors"
          >
            View Register →
          </Link>
        </div>

        {/* SDS Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-chemfetch-accent/10 dark:bg-chemfetch-accent/20 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-chemfetch-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                SDS Documents
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Access safety data sheets</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Access and manage Safety Data Sheets for all chemicals. Ensure compliance and safety
            protocols are up to date.
          </p>
          <Link
            href="/sds"
            className="inline-flex items-center px-4 py-2 bg-chemfetch-accent text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            View SDS →
          </Link>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Barcode Scanning
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant product identification through mobile barcode scanning
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">OCR Recognition</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced text extraction from product labels and documents
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">SDS Management</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Intelligent Safety Data Sheet discovery and verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
