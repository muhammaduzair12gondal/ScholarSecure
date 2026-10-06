import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import { getCurrentUser } from './auth';

function ProtectedRoute({ role, children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'officer' ? '/officer' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer"
        element={
          <ProtectedRoute role="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
