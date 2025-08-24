// src/components/top-nav.tsx

'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Bell, User } from 'lucide-react';

export function TopNav() {
  return (
    <header className="bg-chemfetch-bg-primary/95 border-b border-chemfetch-border backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button and title */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-chemfetch-bg-secondary">
            <Menu size={20} className="text-chemfetch-text-secondary" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-chemfetch-text-primary">Client Hub</h1>
            <p className="text-sm text-chemfetch-text-secondary">
              Chemical Safety Management Dashboard
            </p>
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
          <div className="flex items-center gap-3 pl-3 border-l border-chemfetch-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-chemfetch-text-primary">Client User</p>
              <p className="text-xs text-chemfetch-text-secondary">Dashboard Access</p>
            </div>
            <div className="w-10 h-10 bg-chemfetch-gradient rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
