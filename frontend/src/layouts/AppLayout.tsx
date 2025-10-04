import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const menu = [
  { to: '/', label: 'Inicio', roles: ['*'] },
  { to: '/students', label: 'Estudiantes', perms: ['academic.students.read.school'] },
  { to: '/academic/years', label: 'Años Académicos', perms: ['academic.read.school'] },
  { to: '/users', label: 'Usuarios', perms: ['users.read.school'] },
];

export default function AppLayout() {
  const { session, logout, hasRole, hasPerm } = useAuth();

  const visible = menu.filter(m => {
    if (m.roles?.includes('*')) return true;
    if (m.roles && !hasRole(m.roles)) return false;
    if (m.perms && !hasPerm(m.perms)) return false;
    return true;
  });

  return (
    <div className="h-screen w-full grid grid-cols-[240px_1fr]">
      <aside className="bg-gray-900 text-gray-100 p-4">
        <div className="text-lg font-semibold mb-8">Jorge Basadre – ERP</div>
        <nav className="space-y-1">
          {visible.map(i => (
            <Link
              key={i.to}
              to={i.to}
              className="block rounded px-3 py-2 hover:bg-gray-700"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="bg-gray-50">
        <header className="flex items-center justify-between px-6 h-14 bg-white border-b">
          <div className="font-medium">Panel</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session?.email}</span>
            <button
              onClick={logout}
              className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
            >
              Salir
            </button>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
