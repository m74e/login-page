"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Mail } from 'lucide-react';
import type { AxiosError } from "axios";

const EmailCard = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
     const response= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Account/forgot-password`, {
        email,
      });
      setSubmitted(true);
      setMessage(response?.data?.message);
    } catch (err) {
  const error = err as AxiosError<{ message?: string }>;
  setError(error.response?.data?.message || "Something went wrong");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-600/30">
        <h2 className="text-2xl font-bold text-center text-white mb-6 animate-fade-in">
          Forgot Password
        </h2>

        {submitted ? (
          <p className="text-green-400 text-center">
           {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 pr-12 focus:outline-none transition duration-300 border-gray-700"
              />
              <Mail className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailCard;
