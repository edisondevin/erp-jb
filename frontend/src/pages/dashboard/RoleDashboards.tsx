import { useAuth } from '../../auth/AuthContext';
export default function RoleDashboard() {
  const { session, hasRole } = useAuth();

  if (hasRole('SUPER_ADMIN')) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard – Super Admin</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Usuarios" value="Gestión completa" />
          <Card title="Académico" value="Todo el control" />
          <Card title="Reportes" value="Indicadores globales" />
        </div>
      </div>
    );
  }
  if (hasRole('DIRECTOR')) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard – Dirección</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Matrículas" value="Resumen por grado" />
          <Card title="Asistencia" value="Alertas" />
          <Card title="Docentes" value="Estado de sílabos" />
        </div>
      </div>
    );
  }
  if (hasRole('DOCENTE')) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard – Docente</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Cursos" value="Mis asignaturas" />
          <Card title="Tareas" value="Entregas pendientes" />
        </div>
      </div>
    );
  }
  if (hasRole('ESTUDIANTE')) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard – Estudiante</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Notas" value="Mi promedio" />
          <Card title="Tareas" value="Pendientes" />
        </div>
      </div>
    );
  }
  if (hasRole('PADRE')) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard – Padre/Madre</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Progreso" value="Reporte del estudiante" />
          <Card title="Asistencia" value="Resumen semanal" />
        </div>
      </div>
    );
  }
  return <div>Bienvenido.</div>;
}

const Card: React.FC<{title: string; value: string}> = ({ title, value }) => (
  <div className="rounded border bg-white p-4">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);
