'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('Registration successful! Check your email for a confirmation link.');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow"
      >
        <h1 className="text-xl font-semibold text-center">Register</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
