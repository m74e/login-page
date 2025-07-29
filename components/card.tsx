"use client";

import React, { useState } from 'react';
import { Eye, EyeOff }             from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { AxiosError } from 'axios';

const PasswordCard: React.FC = () => {
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput,    setFocusedInput]    = useState<string | null>(null);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);

  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get('email') || '';
  
  const getRawTokenFromURL = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      const tokenMatch = url.match(/[?&]token=([^&]*)/);
      return tokenMatch ? tokenMatch[1] : '';
    }
    return '';
  };
  
  const token = getRawTokenFromURL();

  console.log('→ Raw token from URL (unprocessed):', token);
  console.log('→ Email:', email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { email, token, newPassword, confirmPassword };
      console.log('→ Sending payload with raw token:', payload);
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Account/reset-password`,
        payload
      );
      router.push('/login');
    // } catch (err: any) {
    //   console.error('Reset failed:', err.response?.data || err.message);
    // }
    }
    catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error('Reset failed:', err.response?.data || err.message);
  } else if (err instanceof Error) {
    console.error('Reset failed:', err.message);
  } else {
    console.error('Reset failed: Unknown error occurred.', err);
  }
}

  
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl transform transition hover:scale-[1.02] hover:shadow-indigo-600/30">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onFocus={() => setFocusedInput('new')}
              onBlur={() => setFocusedInput(null)}
              onChange={e => setNewPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none transition ${
                focusedInput === 'new'
                  ? 'border-indigo-500 shadow-indigo-500/20 shadow'
                  : 'border-gray-700'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-indigo-400"
            >
              {showNew ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onFocus={() => setFocusedInput('confirm')}
              onBlur={() => setFocusedInput(null)}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none transition ${
                focusedInput === 'confirm'
                  ? 'border-indigo-500 shadow-indigo-500/20 shadow'
                  : 'border-gray-700'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-indigo-400"
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordCard;