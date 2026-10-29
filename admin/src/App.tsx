import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectEdit from './pages/ProjectEdit';
import Services from './pages/Services';
import Inquiries from './pages/Inquiries';
import Settings from './pages/Settings';
import Homepage from './pages/Homepage';
import Philosophy from './pages/Philosophy';
import Media from './pages/Media';
import Seo from './pages/Seo';

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-full items-center justify-center text-ink-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectEdit />} />
        <Route path="projects/:id" element={<ProjectEdit />} />
        <Route path="services" element={<Services />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="homepage" element={<Homepage />} />
        <Route path="philosophy" element={<Philosophy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="seo" element={<Seo />} />
        <Route path="media" element={<Media />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
