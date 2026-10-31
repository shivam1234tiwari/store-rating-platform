import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { validatePassword } from '../components/ValidationHelpers';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');

        if (!validatePassword(password)) {
            return setError('Password must be 8-16 characters with at least one uppercase letter and one special character.');
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess('Password updated successfully!');
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'store_owner') navigate('/owner');
                else navigate('/user');
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Password</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}
                
                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">New Password (8-16 chars, Uppercase + Special)</label>
                    <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">Update Password</button>
            </form>
        </div>
    );
}
