"use client";
import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AxiosError } from "axios";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with your real login endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Account/login`,
        { email, password }
      );

      // Save token or session here
      console.log(response.data);

      // Redirect or update UI
      router.push("/dashboard"); // Example route
    } catch (err) {
  const error = err as AxiosError<{ message?: string }>;
  setError(error.response?.data?.message || "Invalid credentials");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-600/30">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 pr-12 focus:outline-none transition duration-300 border-gray-700"
            />
          </div>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 pr-12 focus:outline-none transition duration-300 border-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowPass((prev) => !prev)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-400">
          Forgot your password?{" "}
          <Link
            href="/email"
            className="text-indigo-400 hover:underline transition"
          >
            Reset here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
