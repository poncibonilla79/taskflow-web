import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
}

const navItems = [
  {
    to: '/dashboard',
    label: 'Inicio',
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'Tareas',
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: '/projects',
    label: 'Proyectos',
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  
  {
    to: '/settings',
    label: 'Configuración',
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar({ open, collapsed, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-14 lg:inset-y-0 left-0 z-40 lg:z-0 ${
          collapsed ? 'w-16' : 'w-64'
        } bg-gradient-to-b from-indigo-600 to-violet-600 transform transition-all duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <nav className={`flex-1 p-3 pt-4 space-y-1 ${collapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `relative group flex items-center ${
                  collapsed ? 'justify-center px-0' : 'gap-3 px-4'
                } py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white border-l-2 border-white font-medium'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {!collapsed && item.label}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-800 text-white text-xs
                                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                                whitespace-nowrap top-1/2 -translate-y-1/2 z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`border-t border-white/10 ${collapsed ? 'p-3 flex justify-center' : 'p-3'}`}>
          <button
            onClick={() => { handleLogout(); onClose(); }}
            className={`relative group flex items-center ${
              collapsed ? 'justify-center w-10 h-10' : 'gap-3 w-full px-4'
            } py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-rose-300 transition-all duration-150`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && 'Cerrar sesión'}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-800 text-white text-xs
                              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                              whitespace-nowrap top-1/2 -translate-y-1/2 z-50 shadow-lg">
                Cerrar sesión
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
