// Central API Helper for JWT Authentication

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  
  console.log("=== AUTH DEBUG ===");
  console.log("Token from localStorage:", token);
  console.log("Token exists:", !!token);
  
  if (!token) {
    console.error("No token found in localStorage");
    return {
      "Content-Type": "application/json"
    };
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  
  console.log("=== API REQUEST DEBUG ===");
  console.log("URL:", url);
  console.log("Token:", token);
  console.log("Token exists:", !!token);
  console.log("Method:", options.method || 'GET');
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log("=== API RESPONSE DEBUG ===");
    console.log("Status:", response.status);
    console.log("Response:", data);
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error("=== API ERROR DEBUG ===");
    console.error("Error:", error);
    
    if (error instanceof Error && error.message.includes("No token")) {
      console.log("Redirecting to login due to missing token");
      window.location.href = "/login";
    }
    
    throw error;
  }
};

export const markComplete = async (tutorialId: string) => {
  try {
    console.log("=== MARK COMPLETE DEBUG ===");
    console.log("Tutorial ID:", tutorialId);
    console.log("TOKEN:", localStorage.getItem("token"));
    
    const headers = getAuthHeaders();
    console.log("Headers:", headers);
    
    const res = await fetch("http://localhost:5000/api/tutorials/complete", {
      method: "POST",
      headers,
      body: JSON.stringify({ tutorialId })
    });

    const data = await res.json();
    
    console.log("=== MARK COMPLETE RESPONSE ===");
    console.log("Status:", res.status);
    console.log("Data:", data);

    if (!res.ok) {
      throw new Error(data.message);
    }

    console.log("Completed:", data);
    return data;
  } catch (error) {
    console.error("=== MARK COMPLETE ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : error);
    
    if (error instanceof Error && error.message.includes("No token")) {
      window.location.href = "/login";
    }
    
    throw error;
  }
};
