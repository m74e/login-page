"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordCard = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-600/30">
        <h2 className="text-2xl font-bold text-center text-white mb-6 animate-fade-in">
          Reset Your Password
        </h2>

        <form className="space-y-5">
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onFocus={() => setFocusedInput('new')}
              onBlur={() => setFocusedInput(null)}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 pr-12 focus:outline-none transition duration-300 ${
                focusedInput === 'new'
                  ? 'border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'border-gray-700'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onFocus={() => setFocusedInput('confirm')}
              onBlur={() => setFocusedInput(null)}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 pr-12 focus:outline-none transition duration-300 ${
                focusedInput === 'confirm'
                  ? 'border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'border-gray-700'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordCard;
