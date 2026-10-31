import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const { user, logout, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [message, setMessage] = useState('');

    const fetchStores = async () => {
        try {
            const params = new URLSearchParams({ search, sortBy, order });
            const res = await fetch(`http://localhost:5000/api/user/stores?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setStores(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [search, sortBy, order]);

    const handleRate = async (storeId, ratingValue) => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/stores/${storeId}/rating`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ rating: ratingValue })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMessage('Rating submitted successfully!');
            fetchStores();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                <div className="space-x-4">
                    <button onClick={() => navigate('/change-password')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Change Password</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            {message && <div className="bg-blue-100 text-blue-700 p-3 mb-4 rounded">{message}</div>}

            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Registered Stores</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                    <input type="text" placeholder="Search by name or address..." className="border p-2 rounded flex-1 min-w-[200px]" value={search} onChange={e => setSearch(e.target.value)} />
                    <select className="border p-2 rounded bg-white" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="name">Sort by Name</option>
                        <option value="address">Sort by Address</option>
                        <option value="overall_rating">Sort by Overall Rating</option>
                    </select>
                    <button onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')} className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 font-semibold">{order}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stores.map(store => (
                        <div key={store.id} className="border p-4 rounded shadow-sm bg-white flex flex-col justify-between hover:border-blue-300">
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">{store.name}</h4>
                                <p className="text-gray-600 text-sm mb-2">{store.address}</p>
                                <p className="text-sm font-semibold mb-2">Overall Rating: <span className="text-blue-600">{Number(store.overall_rating).toFixed(1)} / 5</span></p>
                                <p className="text-sm mb-4">Your Rating: <span className="font-bold">{store.user_rating ? `${store.user_rating} / 5` : 'Not Rated'}</span></p>
                            </div>
                            <div className="flex items-center gap-2 border-t pt-3">
                                <span className="text-sm font-medium text-gray-700">Rate:</span>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star} 
                                        onClick={() => handleRate(store.id, star)}
                                        className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${store.user_rating === star ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                    >
                                        {star}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
