import { NavLink } from 'react-router-dom';
import RequirePermission from '../guard/RequirePermission';
import { useAuth } from '../../auth/AuthProvider';

const Item = ({ to, label }: { to: string; label: string }) => (
  <li className="py-1">
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? 'font-medium text-blue-600' : 'hover:underline')}
    >
      {label}
    </NavLink>
  </li>
);

export default function Sidebar() {
  const { hasRole } = useAuth();

  return (
    <aside className="w-60 p-4 border-r bg-white min-h-screen">
      <h1 className="font-semibold mb-3">ERP JB</h1>
      <ul>
        <Item to="/" label="Inicio" />
        <Item to="/students" label="Estudiantes" />
        <Item to="/academic/years" label="Años Académicos" />

        {/* Con permisos */}
        <RequirePermission perm="users.read.school">
          <Item to="/users" label="Usuarios" />
        </RequirePermission>

        {/* Ejemplo con rol específico */}
        {hasRole('SUPER_ADMIN') && <Item to="/users/new" label="Nuevo Usuario" />}
      </ul>
    </aside>
  );
}
