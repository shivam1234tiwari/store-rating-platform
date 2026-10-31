import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ChangePassword from './pages/ChangePassword';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, loading } = useContext(AuthContext);
    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!token || !user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const RoleBasedRedirect = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'store_owner') return <Navigate to="/owner" replace />;
    return <Navigate to="/user" replace />;
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
                    } />
                    <Route path="/user" element={
                        <ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>
                    } />
                    <Route path="/owner" element={
                        <ProtectedRoute allowedRoles={['store_owner']}><OwnerDashboard /></ProtectedRoute>
                    } />
                    <Route path="/change-password" element={
                        <ProtectedRoute><ChangePassword /></ProtectedRoute>
                    } />
                    <Route path="/" element={<RoleBasedRedirect />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
