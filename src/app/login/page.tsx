'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chemfetch-bg-secondary flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-chemfetch-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-700/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-3xl">🧪</div>
              </div>
              <div>
                <h1 className="text-4xl font-bold">ChemFetch</h1>
                <p className="text-blue-100">Client Hub Dashboard</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">Professional Chemical Safety Management</h2>
            <p className="text-xl text-blue-100 mb-8">
              Access your chemical registers, Safety Data Sheets, and compliance tracking tools.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800/10 rounded-lg flex items-center justify-center">
                  📷
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mobile Barcode Scanning</h3>
                  <p className="text-blue-100">Instant product identification</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  🔍
                </div>
                <div>
                  <h3 className="font-semibold text-lg">OCR Recognition</h3>
                  <p className="text-blue-100">95%+ accuracy text extraction</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-700/10 rounded-lg flex items-center justify-center">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-lg">SDS Management</h3>
                  <p className="text-blue-100">Intelligent safety data verification</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold">~2-5s</div>
                <div className="text-blue-100 text-sm">Average Scan Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-blue-100 text-sm">Uptime Reliability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">🇦🇺</div>
                <div className="text-blue-100 text-sm">Australian Focused</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-chemfetch-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">🧪</div>
            </div>
            <h1 className="text-2xl font-bold text-chemfetch-text-primary">ChemFetch Client Hub</h1>
            <p className="text-chemfetch-text-secondary">Chemical Safety Management</p>
          </div>

          <div className="bg-accent rounded-2xl shadow-chemfetch-lg p-8 border border-chemfetch-border">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-chemfetch-text-primary mb-2">Welcome back</h2>
              <p className="text-chemfetch-text-secondary">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-chemfetch-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-chemfetch-text-secondary" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-chemfetch-border rounded-xl bg-gray-100 dark:bg-chemfetch-bg-secondary text-chemfetch-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chemfetch-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-chemfetch-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-chemfetch-text-secondary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-chemfetch-border rounded-xl bg-gray-100 dark:bg-chemfetch-bg-secondary text-chemfetch-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chemfetch-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-chemfetch-text-secondary" />
                    ) : (
                      <Eye className="h-5 w-5 text-chemfetch-text-secondary" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-chemfetch-primary hover:bg-chemfetch-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chemfetch-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                      <div className="h-full w-full border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-chemfetch-text-secondary">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-chemfetch-primary hover:text-chemfetch-primary-dark transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Link to main website */}
            <div className="mt-6 pt-6 border-t border-chemfetch-border text-center">
              <a
                href="https://chemfetch.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-chemfetch-text-secondary hover:text-chemfetch-primary transition-colors"
              >
                Visit ChemFetch.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
