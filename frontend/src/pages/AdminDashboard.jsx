import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateName, validateEmail, validatePassword, validateAddress } from '../components/ValidationHelpers';

export default function AdminDashboard() {
    const { logout, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    
    // Filters & Sorting state
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('');
    const [userSortBy, setUserSortBy] = useState('name');
    const [userOrder, setUserOrder] = useState('ASC');

    const [storeSearch, setStoreSearch] = useState('');
    const [storeSortBy, setStoreSortBy] = useState('name');
    const [storeOrder, setStoreOrder] = useState('ASC');

    // Forms state
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            
            // Stats
            const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers });
            setStats(await statsRes.json());

            // Users
            const userParams = new URLSearchParams({ search: userSearch, role: userRoleFilter, sortBy: userSortBy, order: userOrder });
            const usersRes = await fetch(`http://localhost:5000/api/admin/users?${userParams}`, { headers });
            setUsers(await usersRes.json());

            // Stores
            const storeParams = new URLSearchParams({ search: storeSearch, sortBy: storeSortBy, order: storeOrder });
            const storesRes = await fetch(`http://localhost:5000/api/admin/stores?${storeParams}`, { headers });
            setStores(await storesRes.json());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userSearch, userRoleFilter, userSortBy, userOrder, storeSearch, storeSortBy, storeOrder]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!validateName(newUser.name)) return setError('Name must be 20-60 characters.');
        if (!validateEmail(newUser.email)) return setError('Invalid email.');
        if (!validatePassword(newUser.password)) return setError('Password criteria not met.');
        if (!validateAddress(newUser.address)) return setError('Address max 400 characters.');

        try {
            const res = await fetch('http://localhost:5000/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess('User added successfully!');
            setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newStore)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess('Store added successfully!');
            setNewStore({ name: '', email: '', address: '', owner_id: '' });
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="space-x-4">
                    <button onClick={() => navigate('/change-password')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Change Password</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow text-center border-t-4 border-blue-500">
                    <h3 className="text-gray-500 font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center border-t-4 border-green-500">
                    <h3 className="text-gray-500 font-medium">Total Stores</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalStores}</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center border-t-4 border-purple-500">
                    <h3 className="text-gray-500 font-medium">Total Ratings</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalRatings}</p>
                </div>
            </div>

            {/* Add User and Store Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <form onSubmit={handleAddUser} className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Add New User</h3>
                    <input type="text" placeholder="Name (20-60 chars)" className="w-full border p-2 mb-3 rounded" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                    <input type="email" placeholder="Email" className="w-full border p-2 mb-3 rounded" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                    <input type="password" placeholder="Password (8-16 chars, Uppercase + Special)" className="w-full border p-2 mb-3 rounded" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                    <input type="text" placeholder="Address" className="w-full border p-2 mb-3 rounded" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required />
                    <select className="w-full border p-2 mb-3 rounded bg-white" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                        <option value="user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">System Administrator</option>
                    </select>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">Add User</button>
                </form>

                <form onSubmit={handleAddStore} className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Add New Store</h3>
                    <input type="text" placeholder="Store Name" className="w-full border p-2 mb-3 rounded" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required />
                    <input type="email" placeholder="Store Email" className="w-full border p-2 mb-3 rounded" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required />
                    <input type="text" placeholder="Address" className="w-full border p-2 mb-3 rounded" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required />
                    <input type="number" placeholder="Owner User ID (optional)" className="w-full border p-2 mb-3 rounded" value={newStore.owner_id} onChange={e => setNewStore({...newStore, owner_id: e.target.value})} />
                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-semibold">Add Store</button>
                </form>
            </div>

            {/* Users Listing & Filters */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Users Listing</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                    <input type="text" placeholder="Search by name, email, address..." className="border p-2 rounded flex-1 min-w-[200px]" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    <select className="border p-2 rounded bg-white" value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select className="border p-2 rounded bg-white" value={userSortBy} onChange={e => setUserSortBy(e.target.value)}>
                        <option value="name">Sort by Name</option>
                        <option value="email">Sort by Email</option>
                        <option value="address">Sort by Address</option>
                        <option value="role">Sort by Role</option>
                    </select>
                    <button onClick={() => setUserOrder(userOrder === 'ASC' ? 'DESC' : 'ASC')} className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 font-semibold">{userOrder}</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Address</th>
                                <th className="p-2 text-left">Role</th>
                                <th className="p-2 text-left">Rating (If Owner)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2">{u.address}</td>
                                    <td className="p-2 uppercase text-xs font-semibold text-gray-600">{u.role}</td>
                                    <td className="p-2">{u.role === 'store_owner' ? (u.rating ? Number(u.rating).toFixed(1) : 'No Ratings') : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stores Listing & Filters */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Stores Listing</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                    <input type="text" placeholder="Search by name, email, address..." className="border p-2 rounded flex-1 min-w-[200px]" value={storeSearch} onChange={e => setStoreSearch(e.target.value)} />
                    <select className="border p-2 rounded bg-white" value={storeSortBy} onChange={e => setStoreSortBy(e.target.value)}>
                        <option value="name">Sort by Name</option>
                        <option value="email">Sort by Email</option>
                        <option value="address">Sort by Address</option>
                        <option value="rating">Sort by Rating</option>
                    </select>
                    <button onClick={() => setStoreOrder(storeOrder === 'ASC' ? 'DESC' : 'ASC')} className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 font-semibold">{storeOrder}</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Address</th>
                                <th className="p-2 text-left">Overall Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map(s => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{s.name}</td>
                                    <td className="p-2">{s.email}</td>
                                    <td className="p-2">{s.address}</td>
                                    <td className="p-2 font-bold text-blue-600">{Number(s.rating).toFixed(1)} / 5</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
