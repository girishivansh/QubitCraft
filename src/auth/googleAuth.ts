// Google Identity Services (GIS) Client Integration

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: any) => void) => void;
        };
      };
    };
  }
}

export interface GoogleUserProfile {
  name: string;
  email: string;
  avatar?: string;
  sub?: string;
}

const LOCAL_STORAGE_CLIENT_ID_KEY = 'qubitcraft_google_client_id';

/**
 * Gets the configured Google Client ID from environment variables or local storage
 */
export function getGoogleClientId(): string {
  const envClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envClientId && !envClientId.startsWith('GOCSPX-')) return envClientId;

  const storedClientId = (localStorage.getItem(LOCAL_STORAGE_CLIENT_ID_KEY) || '').trim();
  if (storedClientId && !storedClientId.startsWith('GOCSPX-')) return storedClientId;

  return '';
}

/**
 * Saves a Google Client ID in local storage for instant runtime testing
 */
export function setRuntimeGoogleClientId(clientId: string): void {
  if (clientId.trim()) {
    localStorage.setItem(LOCAL_STORAGE_CLIENT_ID_KEY, clientId.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_CLIENT_ID_KEY);
  }
}

/**
 * Ensures Google Identity Services script is loaded in the DOM
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-gsi-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

/**
 * Initiates the authentic Google OAuth 2.0 popup flow using Google Identity Services
 */
export async function triggerGoogleOAuth(
  clientId: string,
  onSuccess: (profile: GoogleUserProfile) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    await loadGoogleScript();

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services SDK failed to initialize');
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: async (response) => {
        if (response.error) {
          onError(response.error);
          return;
        }

        if (!response.access_token) {
          onError('Failed to acquire Google access token');
          return;
        }

        try {
          // Fetch authenticated user profile from Google's userinfo endpoint
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Google UserInfo API error: ${res.statusText}`);
          }

          const data = await res.json();
          onSuccess({
            name: data.name || data.given_name || 'Google User',
            email: data.email,
            avatar: data.picture,
            sub: data.sub,
          });
        } catch (fetchErr: any) {
          onError(fetchErr.message || 'Failed to fetch Google profile details');
        }
      },
      error_callback: (err) => {
        onError(err?.message || 'Google Sign-In was cancelled or encountered an error');
      },
    });

    // Opens Google's authentic accounts.google.com popup
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err: any) {
    onError(err.message || 'Unable to open Google Sign-In popup');
  }
}
