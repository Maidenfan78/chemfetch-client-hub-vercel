// src/components/top-nav.tsx

'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function TopNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();

    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Close user menu when auth state changes
      if (event === 'SIGNED_OUT') {
        setShowUserMenu(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatUserEmail = (email: string | undefined) => {
    if (!email) {
      return 'Unknown User';
    }
    if (email.length > 25) {
      return email.substring(0, 22) + '...';
    }
    return email;
  };

  const getUserInitials = (email: string | undefined) => {
    if (!email) {
      return 'U';
    }
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <header className="bg-chemfetch-bg-primary/95 border-b border-chemfetch-border backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button and title */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-chemfetch-bg-secondary">
            <Menu size={20} className="text-chemfetch-text-secondary" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-chemfetch-text-primary">ChemFetch Hub</h1>
            <p className="text-sm text-chemfetch-text-secondary">Chemical Safety Management</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-chemfetch-bg-secondary relative">
            <Bell size={20} className="text-chemfetch-text-secondary" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-chemfetch-accent rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <div className="relative">
            {loading ? (
              <div className="flex items-center gap-3 pl-3 border-l border-chemfetch-border p-2">
                <div className="text-right hidden sm:block">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
                </div>
              </div>
            ) : user ? (
              <div
                className="flex items-center gap-3 pl-3 border-l border-chemfetch-border cursor-pointer hover:bg-chemfetch-bg-secondary rounded-lg p-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-chemfetch-text-primary">
                    {formatUserEmail(user.email)}
                  </p>
                  <p className="text-xs text-chemfetch-text-secondary">
                    {user.email_confirmed_at ? 'Verified Account' : 'Pending Verification'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-chemfetch-gradient rounded-full flex items-center justify-center text-white font-medium">
                  {getUserInitials(user.email)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-3 border-l border-chemfetch-border">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-chemfetch-text-primary">Please Login</p>
                  <p className="text-xs text-chemfetch-text-secondary">Access Required</p>
                </div>
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              </div>
            )}

            {/* User Dropdown Menu - Only show if user is logged in */}
            {showUserMenu && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Signed in as
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    User ID: {user.id.substring(0, 8) + '...'}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Could navigate to profile/settings page in the future
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings size={16} />
                    Account Settings
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu - Only if user is logged in */}
      {showUserMenu && user && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </header>
  );
}
