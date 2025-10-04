import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

type Mode = 'create' | 'edit';
type Props = { mode: Mode };

type User = {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
};

export default function UserForm({ mode }: Props) {
  const nav = useNavigate();
  const { id } = useParams();

  const [f, setF] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
  });
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        const { data } = await api.get(`/users/${id}`);
        setF({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          isActive: data.user.isActive,
        });
      })();
    }
  }, [id, mode]);

  async function save() {
    if (mode === 'create') {
      await api.post('/users', { ...f, password });
    } else {
      await api.put(`/users/${id}`, f);
    }
    nav('/users');
  }

  return (
    <div>
      <h2>{mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input
          placeholder="Nombres"
          value={f.firstName}
          onChange={(e) => setF({ ...f, firstName: e.target.value })}
        />
        <input
          placeholder="Apellidos"
          value={f.lastName}
          onChange={(e) => setF({ ...f, lastName: e.target.value })}
        />
        <input
          placeholder="Email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        {mode === 'create' && (
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        {mode === 'edit' && (
          <label>
            <input
              type="checkbox"
              checked={!!f.isActive}
              onChange={(e) => setF({ ...f, isActive: e.target.checked })}
            />
            &nbsp;Activo
          </label>
        )}
        <div>
          <button onClick={save}>Guardar</button>
          <button onClick={() => nav('/users')} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
