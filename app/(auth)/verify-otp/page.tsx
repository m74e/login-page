"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

const OTP_LENGTH = 6;

const VerifyOtpPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      setError("Email parameter is missing. Please try again.");
      return;
    }
    inputsRef.current[0]?.focus();
  }, [email]);

  const focusInput = useCallback((idx: number) => {
    if (idx >= 0 && idx < OTP_LENGTH) {
      inputsRef.current[idx]?.focus();
    }
  }, []);

  const handleChange = useCallback((value: string, idx: number) => {
    // Only allow numeric input and take the last digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    
    // Auto-focus next input if digit entered
    if (digit && idx < OTP_LENGTH - 1) {
      focusInput(idx + 1);
    }
  }, [focusInput]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === "Backspace") {
        if (!otp[idx] && idx > 0) {
          // If current field is empty and backspace pressed, go to previous field
          focusInput(idx - 1);
        } else if (otp[idx]) {
          // If current field has value, clear it
          setOtp((prev) => {
            const next = [...prev];
            next[idx] = "";
            return next;
          });
        }
      } else if (e.key === "ArrowLeft" && idx > 0) {
        focusInput(idx - 1);
      } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
        focusInput(idx + 1);
      }
    },
    [otp, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/[^0-9]/g, "")
        .slice(0, OTP_LENGTH);
      
      if (pasted) {
        const digits = pasted.split("");
        const newOtp = Array(OTP_LENGTH).fill("");
        
        digits.forEach((digit, index) => {
          if (index < OTP_LENGTH) {
            newOtp[index] = digit;
          }
        });
        
        setOtp(newOtp);
        
        const nextFocusIndex = Math.min(digits.length, OTP_LENGTH - 1);
        setTimeout(() => focusInput(nextFocusIndex), 0);
      }
    },
    [focusInput]
  );

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    try {
      const accessTokenExpiry = 60 * 60; // 1 hour
      const refreshTokenExpiry = 60 * 60 * 24 * 7; // 7 days
      
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessTokenExpiry}; secure; samesite=strict`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshTokenExpiry}; secure; samesite=strict`;

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      
      return true;
    } catch (error) {
      console.error("Error setting tokens:", error);
      return false;
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      
      if (!email) {
        setError("Email is required. Please try again.");
        return;
      }
      
      const code = otp.join("");
      if (code.length !== OTP_LENGTH) {
        setError(`Please enter all ${OTP_LENGTH} digits of the OTP.`);
        return;
      }
      
      if (!/^\d+$/.test(code)) {
        setError("OTP must contain only numbers.");
        return;
      }

      setLoading(true);
      
      try {
        const response = await api.post("/Account/verify-otp", {
          email: email.trim(),
          otp: code,
        });
        
        const { data } = response;
        
        if (!data?.accessToken || !data?.refreshToken) {
          throw new Error("Invalid response: missing tokens");
        }
        
        const { accessToken, refreshToken } = data;
        
        const tokensSet = setTokens(accessToken, refreshToken);
        
        if (!tokensSet) {
          throw new Error("Failed to store authentication tokens");
        }
        
        router.push("/dashboard");
        
      } catch (err: any) {
        console.error("OTP verification error:", err);
        
        if (err.response?.status === 400) {
          setError("Invalid OTP. Please check and try again.");
        } else if (err.response?.status === 404) {
          setError("Email not found. Please try again.");
        } else if (err.response?.status === 429) {
          setError("Too many attempts. Please try again later.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Verification failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [email, otp, router, setTokens]
  );

  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Verify OTP
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the 6-digit code sent to
          </p>
          <p className="text-indigo-400 text-sm font-medium">{email}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-12 h-12 bg-gray-800 text-white text-center text-lg font-semibold rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                autoComplete="off"
              />
            ))}
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !isOtpComplete}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                onClick={() => {
                  // Add resend functionality here
                  console.log("Resend OTP for:", email);
                }}
              >
                Resend
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;