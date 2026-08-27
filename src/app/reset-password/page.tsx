"use client";

import React, { useState, useEffect } from 'react';
import YellowButton from '@/components/ui/YellowButton';
import { supabase } from '@/lib/supabase/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid session (user clicked the email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#4A90E2] via-[#8CB8E8] to-white px-4">
      <div className="flex-1 flex justify-center items-center py-12">
        <div className="bg-white/90 rounded-3xl shadow-2xl px-10 py-12 w-full max-w-md border-0 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-black tracking-tight">
            Reset Password
          </h1>
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-lg font-medium">
                Password reset successful!
              </div>
              <p className="text-gray-600 text-sm">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center font-medium">{error}</div>
              )}
              <YellowButton 
                type="submit" 
                className="w-full py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition-all bg-[#FFD700] text-[#10151c]" 
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </YellowButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
