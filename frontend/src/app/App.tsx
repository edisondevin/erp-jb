// frontend/src/app/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '../auth/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
