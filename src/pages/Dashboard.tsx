import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Activity, Users, DollarSign, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Resumen de Hoy</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="flex items-center gap-4 py-8">
                        <div className="p-4 bg-dark-800 rounded-lg text-gold-500">
                            <CheckSquare size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Check-In Rápido</p>
                            <Link to="/check-in" className="text-lg font-bold hover:text-gold-400 transition-colors">Registrar Ingreso →</Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 py-8">
                        <div className="p-4 bg-dark-800 rounded-lg text-green-500">
                            <DollarSign size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Pagos</p>
                            <Link to="/payments" className="text-lg font-bold hover:text-green-400 transition-colors">Nuevo Pago →</Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 py-8">
                        <div className="p-4 bg-dark-800 rounded-lg text-blue-500">
                            <Users size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Socios</p>
                            <Link to="/members" className="text-lg font-bold hover:text-blue-400 transition-colors">Gestionar Socios →</Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 py-8">
                        <div className="p-4 bg-dark-800 rounded-lg text-purple-500">
                            <Activity size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Planes</p>
                            <Link to="/plans" className="text-lg font-bold hover:text-purple-400 transition-colors">Ver Planes →</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
