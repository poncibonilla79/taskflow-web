import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/useAuth';
import { getInitials } from '../utils/initials';
import AvatarCard from './AvatarCard';

interface HeaderProps {
  onToggleSidebar: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Proyectos',
  '/tasks': 'Tareas',
  '/settings': 'Configuración',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/projects/')) return 'Proyecto';
  return '';
}

export default function Header({ onToggleSidebar, collapsed, onToggleCollapse }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 lg:px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
          aria-label="Toggle sidebar collapse"
        >
          <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'} />
          </svg>
        </button>

        <span className="text-white font-bold text-lg hidden sm:inline">TaskFlow</span>

        {pageTitle && (
          <>
            <span className="text-white/40 hidden sm:inline">-</span>
            <span className="text-white/90 text-sm font-medium">{pageTitle}</span>
          </>
        )}
      </div>

      <div className="relative" ref={cardRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
            {user?.name ? getInitials(user.name) : '?'}
          </div>
          <svg
            className={`w-4 h-4 text-white/70 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <AvatarCard
            user={user}
            onClose={() => setMenuOpen(false)}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}
