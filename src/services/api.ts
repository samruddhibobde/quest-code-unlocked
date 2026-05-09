const API_BASE_URL = 'https://codequest-backend-yrse.onrender.com/api';

export interface Tutorial {
  _id: string;
  title: string;
  videoUrl: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  solvedProblems: number;
  completedTutorials: string[];
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CompleteTutorialResponse {
  message: string;
  tutorialId: string;
  tutorialTitle: string;
  completedTutorials: string[];
  totalCompleted: number;
}

export interface SupportRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  topic: string;
  status: 'pending' | 'resolved';
  mentorResponse: string;
  createdAt: string;
  updatedAt: string;
}

// Auth token management
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('token');
};

// API helper function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`API Request: ${endpoint}`);
  console.log('Token available:', !!token);
  console.log('Token value:', token?.substring(0, 20) + '...');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    console.log('API Response status:', response.status);
    console.log('API Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const data = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token after successful response
    localStorage.setItem("token", data.token);
    return data;
  },
  
  logout: () => {
    removeToken();
  },

  getToken: () => getToken(),

  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    return apiRequest('/users/profile');
  },

  addPoints: async (points: number): Promise<{ message: string; points: number; level: number; solvedProblems: number }> => {
    return apiRequest('/users/add-points', {
      method: 'POST',
      body: JSON.stringify({ points }),
    });
  },
};

// Tutorial API
export const tutorialAPI = {
  getTutorials: async (): Promise<{ message: string; tutorials: Tutorial[]; count: number }> => {
    return apiRequest('/tutorials');
  },

  completeTutorial: async (tutorialId: string): Promise<CompleteTutorialResponse> => {
    return apiRequest('/tutorials/complete', {
      method: 'POST',
      body: JSON.stringify({ tutorialId }),
    });
  },
};

// Support API
export const supportAPI = {
  createRequest: (title: string, description: string, category: string) =>
    apiRequest('/support/request', {
      method: 'POST',
      body: JSON.stringify({ title, description, category })
    }),

  getMyRequests: () =>
    apiRequest('/support/my-requests'),

  getAllRequests: () =>
    apiRequest('/support/all'),

  resolveRequest: (id: string, response: string) =>
    apiRequest(`/support/resolve/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ response })
    }),
};

export default {
  authAPI,
  userAPI,
  tutorialAPI,
  supportAPI,
};
