import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Update the import path if necessary, or create the file if missing
import { api } from '../services/api';
// If your api file is actually in src/services/api.ts, use this path

export default function LoginPage() {
  const [email, setEmail] = useState('edison@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', r.data.accessToken);
      localStorage.setItem('refreshToken', r.data.refreshToken);
      nav('/', { replace: true });
    } catch {
      alert('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form onSubmit={onSubmit} className="w-[360px] space-y-3 rounded-xl border bg-white p-5 shadow">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input className="w-full rounded border px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Contraseña</label>
          <input type="password" className="w-full rounded border px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full rounded bg-indigo-600 px-3 py-2 font-medium text-white disabled:opacity-50">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
