import type { User } from '../types';
import { getInitials } from '../utils/initials';

interface AvatarCardProps {
  user: User | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function AvatarCard({ user, onClose, onNavigate, onLogout }: AvatarCardProps) {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl shadow-black/10 border border-slate-200/60 overflow-hidden animate-in">
      <div className="p-5 text-center border-b border-slate-100">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {user?.name ? getInitials(user.name) : '?'}
        </div>
        <p className="mt-3 font-semibold text-slate-800 text-sm">{user?.name}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
      </div>

      <div className="p-2 space-y-1">
         <button
          onClick={() => { onNavigate('/settings'); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi Perfil
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
