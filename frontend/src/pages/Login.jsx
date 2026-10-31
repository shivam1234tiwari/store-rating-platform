import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            login(data.user, data.token);
            if (data.user.role === 'admin') navigate('/admin');
            else if (data.user.role === 'store_owner') navigate('/owner');
            else navigate('/user');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Platform Login</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border p-2 rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input type="password" className="w-full border p-2 rounded" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">Login</button>
                <p className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register as Normal User</Link></p>
            </form>
        </div>
    );
}
