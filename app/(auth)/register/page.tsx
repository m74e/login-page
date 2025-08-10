'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const RegisterPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await api.post('/Account/register', form);
      router.push('/login');
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.message || 'An error occurred while creating your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-600/30">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />

          {errorMsg && (
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
