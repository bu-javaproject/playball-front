import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from './providers/AuthProvider';
import { QueryProvider } from './providers/QueryProvider';
import { router } from './routes';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  );
}
