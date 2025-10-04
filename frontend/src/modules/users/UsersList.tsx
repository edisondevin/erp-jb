// frontend/src/modules/users/UsersList.tsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import RequirePermission from '../../app/guard/RequirePermission';

type Row = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

export default function UsersList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || '';
  const isActive = searchParams.get('isActive') || ''; // '', 'true', 'false'

  const load = () => {
    const params: any = { page, limit };
    if (search.trim()) params.search = search.trim();
    if (isActive) params.isActive = isActive === 'true'; // enviar booleano al backend

    api.get('/users', { params }).then((r) => {
      setRows(r.data.data);
      setTotal(r.data.total);
    });
  };

  useEffect(() => {
    load();
  }, [page, limit, search, isActive]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(searchParams);
    if (v) next.set(k, v);
    else next.delete(k);
    // opcional: cuando cambian filtros, vuelve a página 1
    if (k !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <RequirePermission perm="users.create">
          <Link to="/users/new" className="px-3 py-2 rounded-md bg-gray-900 text-white text-sm">
            Nuevo
          </Link>
        </RequirePermission>
      </div>

      <div className="bg-white border rounded-xl shadow p-3">
        <div className="flex flex-wrap items-end gap-3 mb-3">
          <div>
            <label className="block text-xs mb-1">Buscar</label>
            <input
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Estado</label>
            <select
              value={isActive}
              onChange={(e) => setParam('isActive', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Por página</label>
            <select
              value={String(limit)}
              onChange={(e) => setParam('limit', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 bg-gray-100">ID</th>
                <th className="text-left p-2 bg-gray-100">Nombre</th>
                <th className="text-left p-2 bg-gray-100">Email</th>
                <th className="text-left p-2 bg-gray-100">Estado</th>
                <th className="text-left p-2 bg-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.userId}>
                  <td className="p-2 border-t">{r.userId}</td>
                  <td className="p-2 border-t">
                    {r.firstName} {r.lastName}
                  </td>
                  <td className="p-2 border-t">{r.email}</td>
                  <td className="p-2 border-t">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-2 border-t text-right">
                    <div className="flex gap-2 justify-end">
                      <RequirePermission perm="users.update">
                        <Link to={`/users/${r.userId}/edit`} className="text-blue-600 hover:underline">
                          Editar
                        </Link>
                      </RequirePermission>
                      <RequirePermission perm="users.assignRole">
                        <Link to={`/users/${r.userId}/roles`} className="text-indigo-600 hover:underline">
                          Roles
                        </Link>
                      </RequirePermission>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setParam('page', String(page - 1))}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm px-2 py-1">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setParam('page', String(page + 1))}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
