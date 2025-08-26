import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase-server';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';

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
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
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
        <div className="bg-chemfetch-bg-primary rounded-xl p-6 shadow-chemfetch border border-chemfetch-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-chemfetch-text-primary">Total Chemicals</h3>
            <BarChart3 size={24} className="text-chemfetch-primary" />
          </div>
          <div className="text-3xl font-bold text-chemfetch-text-primary mb-2">0</div>
          <p className="text-sm text-chemfetch-text-secondary">Registered in your system</p>
        </div>

        <div className="bg-chemfetch-bg-primary rounded-xl p-6 shadow-chemfetch border border-chemfetch-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-chemfetch-text-primary">SDS Documents</h3>
            <FileText size={24} className="text-chemfetch-accent" />
          </div>
          <div className="text-3xl font-bold text-chemfetch-text-primary mb-2">0</div>
          <p className="text-sm text-chemfetch-text-secondary">Safety data sheets available</p>
        </div>

        <div className="bg-chemfetch-bg-primary rounded-xl p-6 shadow-chemfetch border border-chemfetch-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-chemfetch-text-primary">Scan Time</h3>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-chemfetch-text-primary mb-2">~2-5s</div>
          <p className="text-sm text-chemfetch-text-secondary">Average processing time</p>
        </div>

        <div className="bg-chemfetch-bg-primary rounded-xl p-6 shadow-chemfetch border border-chemfetch-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-chemfetch-text-primary">OCR Accuracy</h3>
            <Users size={24} className="text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-chemfetch-text-primary mb-2">95%+</div>
          <p className="text-sm text-chemfetch-text-secondary">Text recognition accuracy</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chemical Register */}
        <div className="bg-chemfetch-bg-primary rounded-xl p-6 shadow-chemfetch border border-chemfetch-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-chemfetch-primary/10 rounded-xl flex items-center justify-center">
              <BarChart3 size={24} className="text-chemfetch-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chemfetch-text-primary">
                Chemical Register
              </h2>
              <p className="text-chemfetch-text-secondary">Manage your chemical inventory</p>
            </div>
          </div>
          <p className="text-chemfetch-text-secondary mb-6">
            View and manage all registered chemicals in your system. Track inventory, safety data,
            and compliance information.
          </p>
          <a
            href="/watchlist"
            className="inline-flex items-center px-4 py-2 bg-chemfetch-primary text-white rounded-lg hover:bg-chemfetch-primary-dark transition-colors"
          >
            View Register →
          </a>
        </div>

        {/* SDS Management */}
        <div className="bg-chemfetch-bg-primary rounded-xl p-6 shadow-chemfetch border border-chemfetch-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-chemfetch-accent/10 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-chemfetch-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chemfetch-text-primary">SDS Documents</h2>
              <p className="text-chemfetch-text-secondary">Access safety data sheets</p>
            </div>
          </div>
          <p className="text-chemfetch-text-secondary mb-6">
            Access and manage Safety Data Sheets for all chemicals. Ensure compliance and safety
            protocols are up to date.
          </p>
          <a
            href="/sds"
            className="inline-flex items-center px-4 py-2 bg-chemfetch-accent text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            View SDS →
          </a>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-chemfetch-bg-primary rounded-2xl p-8 shadow-chemfetch border border-chemfetch-border">
        <h2 className="text-2xl font-bold text-chemfetch-text-primary mb-6">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="font-semibold text-chemfetch-text-primary mb-2">Barcode Scanning</h3>
            <p className="text-chemfetch-text-secondary">
              Instant product identification through mobile barcode scanning
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-chemfetch-text-primary mb-2">OCR Recognition</h3>
            <p className="text-chemfetch-text-secondary">
              Advanced text extraction from product labels and documents
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-chemfetch-text-primary mb-2">SDS Management</h3>
            <p className="text-chemfetch-text-secondary">
              Intelligent Safety Data Sheet discovery and verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
