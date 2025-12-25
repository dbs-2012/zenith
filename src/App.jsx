import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EC2 from './components/EC2';
import ECS from './components/ECS';
import EKS from './components/EKS';
import EBS from './components/EBS';
import RDS from './components/RDS';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes within Layout */}
          <Route index element={<Dashboard />} />
          <Route path="ec2" element={<EC2 />} />
          <Route path="ecs" element={<ECS />} />
          <Route path="eks" element={<EKS />} />
          <Route path="ebs" element={<EBS />} />
          <Route path="rds" element={<RDS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
