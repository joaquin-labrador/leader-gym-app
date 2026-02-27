import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-gold-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 animate-pulse">Cargando sesión...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the current location to return to after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
