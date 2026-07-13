import { useAuth } from '../context/useAuth';
import { getInitials } from '../utils/initials';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Perfil</h1>
      <div className="bg-white rounded-xl border border-slate-200/60 p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
            {user?.name ? getInitials(user.name) : '?'}
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            ID: {user?.id}
          </span>
        </div>
      </div>
    </div>
  );
}
