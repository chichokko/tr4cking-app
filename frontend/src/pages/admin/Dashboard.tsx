const AdminDashboard = () => {
    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ventas del Día */}
            <div className="bg-blue-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Ventas del Día</h3>
            <p className="text-2xl font-bold">Gs. 900,000</p>
            <p className="text-sm">Total de ingresos generados hoy.</p>
            </div>
    
            {/* Clientes Nuevos */}
            <div className="bg-green-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Clientes Nuevos</h3>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm">Clientes registrados hoy.</p>
            </div>
    
            {/* Reservas de Pasajes */}
            <div className="bg-yellow-500 text-white p-6 rounded shadow">
            <h3 className="text-lg font-bold">Reservas de Pasajes</h3>
            <p className="text-2xl font-bold">25</p>
            <p className="text-sm">Reservas activas en el sistema.</p>
            </div>
        </div>
    );
};
export default AdminDashboard;