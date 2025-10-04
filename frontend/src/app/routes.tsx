// frontend/src/app/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './guard/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import RoleDashboard from '../pages/dashboard/RoleDashboards'; // ojo: que el nombre del file/export coincida
import LoginPage from '../pages/auth/LoginPage';

import StudentsList from '../modules/students/StudentsList';
import AcademicYears from '../modules/academic/YearsList';
import UsersList from '../modules/users/UsersList';
import UserForm from '../modules/users/UserForm';
import UserRolesForm from '../modules/users/UserRolesForm';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  // 1) El guard va como elemento del branch
  {
    path: '/',
    element: <ProtectedRoute />,   // ProtectedRoute devuelve <Outlet />
    children: [
      // 2) El layout va debajo y debe tener <Outlet />
      {
        element: <AppLayout />,     // AppLayout con <Outlet /> dentro
        children: [
          { index: true, element: <RoleDashboard /> },
          { path: 'students', element: <StudentsList /> },
          { path: 'academic/years', element: <AcademicYears /> },
          { path: 'users', element: <UsersList /> },
          { path: 'users/new', element: <UserForm mode="create" /> },
          { path: 'users/:id/edit', element: <UserForm mode="edit" /> },
          { path: 'users/:id/roles', element: <UserRolesForm /> },
        ],
      },
    ],
  },
]);
