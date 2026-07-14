import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext'; 
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage    from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SettingsPage from './pages/SettingsPage';
import TasksPage from './pages/TasksPage';
import './App.css';
  
export default function App() { 
  return ( 
    <BrowserRouter> 
      <AuthProvider> 
        <Routes> 
          <Route path="/login"    element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
  
          {/* Rutas protegidas: usan <Outlet /> dentro de ProtectedRoute */} 
          <Route element={<ProtectedRoute />}> 
            <Route path="/dashboard" element={<DashboardPage />} /> 
            <Route path="/projects" element={<ProjectsPage />} /> 
            <Route path="/projects/:id" element={<ProjectDetailPage />} /> 
            <Route path="/tasks" element={<TasksPage />} /> 
            <Route path="/settings" element={<SettingsPage />} /> 
          </Route> 
  
          {/* Raíz → dashboard (si no autenticado, ProtectedRoute va a /login) */} 
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
  
          {/* Cualquier ruta desconocida → login */} 
          <Route path="*" element={<Navigate to="/login" replace />} /> 
        </Routes> 
      </AuthProvider> 
    </BrowserRouter> 
  ); 
}