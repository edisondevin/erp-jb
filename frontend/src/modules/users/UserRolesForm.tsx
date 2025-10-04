import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

type Role = { roleId: number; name: string; description?: string };

export default function UserRolesForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const [all, detail] = await Promise.all([
        api.get<Role[]>('/roles'),
        api.get(`/users/${id}`)
      ]);
      setRoles(all.data);
      setSelected((detail.data.roles || []).map((r: any) => r.roleId));
    })();
  }, [id]);

  function toggle(rid: number) {
    setSelected(prev => prev.includes(rid) ? prev.filter(x => x !== rid) : [...prev, rid]);
  }

  async function save() {
    await api.post(`/users/${id}/roles`, { roleIds: selected });
    nav('/users');
  }

  return (
    <div>
      <h2>Asignar roles</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {roles.map(r => (
          <li key={r.roleId}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(r.roleId)}
                onChange={() => toggle(r.roleId)}
              />
              &nbsp;{r.name} {r.description ? `– ${r.description}` : ''}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={save}>Guardar</button>
      <button onClick={() => nav('/users')} style={{ marginLeft: 8 }}>
        Cancelar
      </button>
    </div>
  );
}
