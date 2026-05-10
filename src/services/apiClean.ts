// CLEAN API SERVICE - Simplified Authentication

const API_BASE_URL = 'https://codequest-backend-yrse.onrender.com/api';

// Simple token functions - ONLY use "token" key
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
  console.log("Token stored:", token.substring(0, 20) + '...');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
  console.log("Token removed");
};

// Simple login function
export const login = async (email: string, password: string) => {
  console.log("=== LOGIN ATTEMPT ===");
  console.log("Email:", email);
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", response.status, data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token
    setToken(data.token);
    console.log("Login successful, token stored");
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Simple protected request function
export const protectedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  console.log("=== PROTECTED REQUEST ===");
  console.log("Endpoint:", endpoint);
  console.log("Token available:", !!token);
  console.log("Token value:", token?.substring(0, 20) + '...');
  
  if (!token) {
    console.error("No token found");
    throw new Error('No token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  console.log("Headers:", headers);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error("Protected request error:", error);
    throw error;
  }
};

// Simple tutorial functions
export const getTutorials = async () => {
  return protectedRequest('/tutorials');
};

export const completeTutorial = async (tutorialId: string) => {
  console.log("=== COMPLETE TUTORIAL ===");
  console.log("Tutorial ID:", tutorialId);
  
  return protectedRequest('/tutorials/complete', {
    method: 'POST',
    body: JSON.stringify({ tutorialId }),
  });
};

// Simple profile function
export const getProfile = async () => {
  return protectedRequest('/users/profile');
};
