// src/components/sidebar.tsx

'use client';

import Link from 'next/link';
import { Home, FileText, LogOut, Eye } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter, usePathname } from 'next/navigation';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = supabaseBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const NavLink = ({
    href,
    icon: Icon,
    children,
    external = false,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
    external?: boolean;
  }) => {
    const isActive = pathname === href;
    const Component = external ? 'a' : Link;
    const linkProps = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };

    return (
      <Component
        {...linkProps}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-chemfetch-bg-primary hover:shadow-chemfetch ${
          isActive
            ? 'bg-chemfetch-primary text-white shadow-lg'
            : 'text-chemfetch-text-secondary hover:text-chemfetch-text-primary'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{children}</span>
      </Component>
    );
  };

  return (
    <aside className="w-72 hidden lg:flex flex-col bg-chemfetch-bg-secondary border-r border-chemfetch-border">
      {/* Header */}
      <div className="p-6 border-b border-chemfetch-border">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🧪</div>
          <div>
            <h1 className="text-xl font-bold text-chemfetch-primary">ChemFetch</h1>
            <p className="text-sm text-chemfetch-text-secondary">Client Hub Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          <div className="px-4 py-2">
            <h2 className="text-xs font-semibold text-chemfetch-text-secondary uppercase tracking-wider">
              Dashboard
            </h2>
          </div>
          <NavLink href="/" icon={Home}>
            Dashboard Overview
          </NavLink>
          <NavLink href="/sds" icon={FileText}>
            SDS Register
          </NavLink>
          <NavLink href="/watchlist" icon={Eye}>
            Chemical Register
          </NavLink>

          <div className="pt-6">
            <div className="px-4 py-2">
              <h2 className="text-xs font-semibold text-chemfetch-text-secondary uppercase tracking-wider">
                Platform
              </h2>
            </div>
            <NavLink href="https://chemfetch.com" icon={Home} external>
              Main Website
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <div className="p-6 border-t border-chemfetch-border">
        <div className="bg-chemfetch-gradient rounded-xl p-4 text-white">
          <h3 className="font-semibold mb-3">Platform Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">~2-5s</div>
              <div className="text-blue-100">Scan Time</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">95%+</div>
              <div className="text-blue-100">OCR Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-chemfetch-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-chemfetch-text-secondary hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
