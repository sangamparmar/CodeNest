// Check if user is authenticated by looking for the JWT token
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Save authentication token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove authentication token
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Get the current auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};