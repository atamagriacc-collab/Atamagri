import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth-context';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { LogIn, Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Check if we're in development mode (localhost)
  const isDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.startsWith('192.168.'));

  useEffect(() => {
    // Check for message in query params
    if (router.query.message) {
      setMessage(router.query.message as string);
    }
  }, [router.query]);

  useEffect(() => {
    // Only initialize Turnstile in production
    if (isDevelopment) return;

    // Initialize Turnstile widget when component mounts
    const initTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !turnstileWidgetId) {
        const widgetId = window.turnstile.render(turnstileRef.current, {
          sitekey: '0x4AAAAAAB2RiJ8Y9p6mzxW4',
          theme: 'auto',
          action: 'login',
          callback: function(token: string) {
            console.log('Turnstile token received:', token ? 'Token generated' : 'No token');
          }
        });
        setTurnstileWidgetId(widgetId);
      }
    };

    // Check if Turnstile is already loaded
    if (window.turnstile) {
      initTurnstile();
    } else {
      // Wait for Turnstile to load
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          initTurnstile();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [turnstileWidgetId, isDevelopment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Skip Turnstile verification in development
      if (!isDevelopment) {
        // Get Turnstile token using the widget API
        let turnstileResponse = null;

        if (window.turnstile && turnstileWidgetId !== null) {
          turnstileResponse = window.turnstile.getResponse(turnstileWidgetId);
        }

        if (!turnstileResponse) {
          setError('Please complete the security verification');
          setIsLoading(false);
          // Reset the Turnstile widget using the widget ID
          if (window.turnstile && turnstileWidgetId !== null) {
            window.turnstile.reset(turnstileWidgetId);
          }
          return;
        }

        // Verify Turnstile token
        const verifyResponse = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: turnstileResponse,
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResult.success) {
          setError('Security verification failed. Please try again.');
          // Reset the Turnstile widget using the widget ID
          if (window.turnstile && turnstileWidgetId !== null) {
            window.turnstile.reset(turnstileWidgetId);
          }
          setIsLoading(false);
          return;
        }
        console.log('Login successful with Turnstile protection');
      } else {
        console.log('Development mode: Skipping Turnstile verification');
      }

      // Proceed with sign in
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('User not found. Please contact admin to create an account.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(error.message || 'An error occurred during sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to ATAMAGRI</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 rounded"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}
              {!isDevelopment ? (
                <div
                  ref={turnstileRef}
                  className="cf-turnstile"
                ></div>
              ) : (
                <div className="p-2 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded text-center">
                  Development Mode: Security verification disabled
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#2ecc71] hover:bg-[#27ae60] mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Need an account?</strong> Please contact your administrator to create an account for you.
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Email: <a href="mailto:atamagriacc@gmail.com" className="font-semibold underline hover:text-blue-900">
                  atamagriacc@gmail.com
                </a>
              </p>
            </div>
            {!isDevelopment && (
              <div className="mt-4 text-center text-xs text-gray-500">
                This site is protected by Cloudflare Turnstile.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}