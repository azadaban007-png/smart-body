import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Wrench, Mail, Settings, Image, Home, BookOpen, Search, LogOut } from 'lucide-react';
import { useAuth } from '../auth';
import { Button } from './ui';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/services', label: 'Services', icon: Wrench },
  { to: '/inquiries', label: 'Inquiries', icon: Mail },
  { to: '/homepage', label: 'Homepage', icon: Home },
  { to: '/philosophy', label: 'Philosophy', icon: BookOpen },
  { to: '/settings', label: 'Website Settings', icon: Settings },
  { to: '/seo', label: 'SEO', icon: Search },
  { to: '/media', label: 'Media', icon: Image },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <aside className="flex w-60 flex-none flex-col border-r border-ink-200 bg-white">
        <div className="px-5 py-5">
          <div className="text-sm font-semibold text-ink-900">Shadi Ghader</div>
          <div className="text-xs text-ink-400">Admin CMS</div>
        </div>
        <nav className="flex-1 space-y-0.5 px-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink-200 p-3">
          <div className="mb-2 px-2 text-xs text-ink-400">{user?.email}</div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-ink-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
