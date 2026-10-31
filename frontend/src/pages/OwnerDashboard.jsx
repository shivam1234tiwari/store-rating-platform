import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
    const { logout, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/owner/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setDashboardData(data))
        .catch(err => console.error(err));
    }, [token]);

    if (!dashboardData) return <div className="text-center p-10">Loading...</div>;

    const { store, average_rating, ratings } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
                <h1 className="text-2xl font-bold text-gray-800">Store Owner Dashboard</h1>
                <div className="space-x-4">
                    <button onClick={() => navigate('/change-password')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Change Password</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            {!store ? (
                <div className="bg-white p-6 rounded shadow text-center">
                    <p className="text-gray-600">No store has been assigned to your account yet by the System Administrator.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-blue-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h2>
                        <p className="text-gray-600 mb-2">{store.address}</p>
                        <p className="text-lg font-semibold">Average Store Rating: <span className="text-blue-600 font-bold">{Number(average_rating).toFixed(1)} / 5</span></p>
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Users Who Submitted Ratings</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="p-2 text-left">User Name</th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">Rating</th>
                                        <th className="p-2 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ratings.map((r, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{r.name}</td>
                                            <td className="p-2">{r.email}</td>
                                            <td className="p-2 font-bold text-blue-600">{r.rating} / 5</td>
                                            <td className="p-2 text-sm text-gray-500">{new Date(r.updated_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
