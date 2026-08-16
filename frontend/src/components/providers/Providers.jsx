'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import i18n from '../../i18n';

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    setMounted(true);
    // Load language on client after hydration is complete
    const savedLang = localStorage.getItem('lang');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <QueryClientProvider client={queryClient}>
        {children}
        {mounted && (
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E1E1E',
                color: '#F0F0F0',
                border: '1px solid rgba(255,107,0,0.3)',
              },
              success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } },
            }}
          />
        )}
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
