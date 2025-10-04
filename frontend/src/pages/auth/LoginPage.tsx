import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('edison@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api<{
        accessToken: string;
        refreshToken: string;
        roles: string[];
        perms: string[];
      }>('/auth/login', {
        method: 'POST',
        data: { email, password }
      });

      login({ accessToken: res.data.accessToken, email, roles: res.data.roles, perms: res.data.perms });
      nav('/');
    } catch (e: any) {
      setErr(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Iniciar sesión</h1>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div>
          <label className="text-sm block mb-1">Email</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={email} onChange={e=>setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Contraseña</label>
          <input
            className="w-full rounded border px-3 py-2"
            type="password" value={password} onChange={e=>setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full rounded bg-indigo-600 text-white py-2 hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
