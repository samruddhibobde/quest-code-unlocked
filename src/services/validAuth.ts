// Validated Authentication - Only stores token on SUCCESS

const API_BASE_URL = 'https://codequest-backend-yrse.onrender.com/api';

export const validLogin = async (email: string, password: string) => {
  try {
    console.log("=== VALID LOGIN ATTEMPT ===");
    console.log("Email:", email);
    console.log("Password:", password);
    
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response status:", res.status);
    console.log("Login response data:", data);

    // 🔥 IMPORTANT FIX - Only proceed if response is OK
    if (!res.ok) {
      console.log("❌ Login failed:", data.message);
      alert(data.message); // Show error (Invalid credentials / User not found)
      return; // STOP execution
    }

    // ✅ ONLY RUN IF SUCCESS
    console.log("✅ Login successful, storing token");
    localStorage.setItem("token", data.token);
    console.log("TOKEN SAVED:", data.token);

    // Get user data
    const profileRes = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.token}`,
      },
    });

    const profileData = await profileRes.json();
    console.log("Profile data:", profileData);

    return {
      token: data.token,
      user: profileData,
    };
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
    throw error;
  }
};
