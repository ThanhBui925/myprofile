import { useCallback, useEffect, useState } from 'react';

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

// Load Facebook SDK dynamically
function loadFacebookSDK() {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v19.0',
      });
      resolve(window.FB);
    };

    // Check if script already exists
    if (document.getElementById('facebook-jssdk')) {
      if (window.FB) resolve(window.FB);
      return;
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });
}

export default function FacebookLoginButton({ onSuccess, onError, text = 'signin_with' }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!FACEBOOK_APP_ID) return;
    loadFacebookSDK().then(() => setSdkReady(true));
  }, []);

  const handleClick = useCallback(() => {
    if (!window.FB || loading) return;
    setLoading(true);

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          onSuccess?.({ accessToken, userID });
        } else {
          onError?.('Đăng nhập Facebook bị hủy');
        }
        setLoading(false);
      },
      { scope: 'email,public_profile' }
    );
  }, [loading, onSuccess, onError]);

  if (!FACEBOOK_APP_ID) return null;

  const buttonText = text === 'signup_with' ? 'Đăng ký bằng Facebook' : 'Đăng nhập bằng Facebook';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!sdkReady || loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.625rem 1rem',
        background: '#1877F2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: 600,
        fontFamily: 'Helvetica, Arial, sans-serif',
        cursor: sdkReady && !loading ? 'pointer' : 'not-allowed',
        opacity: sdkReady && !loading ? 1 : 0.6,
        transition: 'background 0.2s, opacity 0.2s',
        minHeight: '40px',
      }}
      onMouseEnter={(e) => {
        if (sdkReady && !loading) e.currentTarget.style.background = '#166FE5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#1877F2';
      }}
    >
      {/* Facebook icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 14, height: 14,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Loading...
        </span>
      ) : (
        buttonText
      )}
    </button>
  );
}
