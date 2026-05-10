// Simple Authentication - No Over-Engineering

const API_BASE_URL = 'https://codequest-backend-yrse.onrender.com/api';

export const simpleLogin = async (email: string, password: string) => {
  try {
    console.log("=== SIMPLE LOGIN ===");
    console.log("Email:", email);
    console.log("Password:", password);
    
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response status:", response.status);
    console.log("Login response data:", data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    localStorage.setItem("token", data.token);
    console.log("TOKEN SAVED:", data.token);
    console.log("Token in localStorage:", localStorage.getItem("token"));

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const simpleGetTutorials = async () => {
  try {
    console.log("=== SIMPLE GET TUTORIALS ===");
    
    const token = localStorage.getItem("token");
    console.log("Token available:", !!token);
    console.log("Token value:", token?.substring(0, 20) + '...');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/tutorials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Tutorials response status:", response.status);
    console.log("Tutorials response data:", data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tutorials');
    }

    return data;
  } catch (error) {
    console.error("Get tutorials error:", error);
    throw error;
  }
};

export const simpleCompleteTutorial = async (tutorialId: string) => {
  try {
    console.log("=== SIMPLE COMPLETE TUTORIAL ===");
    console.log("Tutorial ID:", tutorialId);
    
    const token = localStorage.getItem("token");
    console.log("Token available:", !!token);
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/tutorials/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ tutorialId }),
    });

    const data = await response.json();
    console.log("Complete tutorial response status:", response.status);
    console.log("Complete tutorial response data:", data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete tutorial');
    }

    return data;
  } catch (error) {
    console.error("Complete tutorial error:", error);
    throw error;
  }
};

export const simpleGetProfile = async () => {
  try {
    console.log("=== SIMPLE GET PROFILE ===");
    
    const token = localStorage.getItem("token");
    console.log("Token available:", !!token);
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Profile response status:", response.status);
    console.log("Profile response data:", data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};
