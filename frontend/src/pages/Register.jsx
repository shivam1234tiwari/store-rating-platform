import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateName, validateEmail, validatePassword, validateAddress } from '../components/ValidationHelpers';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateName(form.name)) return setError('Name must be between 20 and 60 characters.');
        if (!validateEmail(form.email)) return setError('Invalid email format.');
        if (!validatePassword(form.password)) return setError('Password must be 8-16 chars with 1 uppercase & 1 special character.');
        if (!validateAddress(form.address)) return setError('Address cannot exceed 400 characters.');

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Normal User Registration</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Name (20-60 chars)</label>
                    <input type="text" className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border p-2 rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password (8-16 chars, Uppercase + Special)</label>
                    <input type="password" className="w-full border p-2 rounded" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Address (Max 400 chars)</label>
                    <textarea className="w-full border p-2 rounded" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">Register</button>
                <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link></p>
            </form>
        </div>
    );
}
