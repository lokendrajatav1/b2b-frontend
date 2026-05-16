const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `http://${window.location.hostname}:5000/api` 
    : 'http://localhost:5000/api');

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isFormData = typeof window !== 'undefined' && options.body instanceof FormData;

  const defaultHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions = {
    ...options,
    credentials: 'include', // Crucial for cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    let data = await response.json();

    if (!response.ok) {
      // Check for token expiration
      if (response.status === 401 && data.message === 'TOKEN_EXPIRED') {
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });

            const refreshData = await refreshResponse.json();

            if (refreshResponse.ok) {
              const newToken = refreshData.data.token;
              localStorage.setItem('token', newToken);
              
              isRefreshing = false;
              onRefreshed(newToken);
            } else {
              // Refresh failed
              isRefreshing = false;
              localStorage.removeItem('token');
              if (typeof window !== 'undefined') window.location.href = '/login';
              throw new Error('Session expired. Please login again.');
            }
          } catch (err) {
            isRefreshing = false;
            throw err;
          }
        }

        // Wait for refresh to complete
        const retryWithNewToken = new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            // Update the auth header and retry
            fetchOptions.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(fetch(`${BASE_URL}${endpoint}`, fetchOptions).then(res => res.json()));
          });
        });

        return retryWithNewToken;
      }

      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
