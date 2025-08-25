import axios, { AxiosInstance } from 'axios';

// Create an axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ this should match your Express server
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------- Types -------------------
export interface CustomerSignupData {
  first_name: string;
  last_name: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  password: string;
}

export interface CustomerLoginData {
  email: string;
  password: string;
}

// ------------------- Customer APIs -------------------

// Login customer
export const loginCustomer = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/customers/login", data);

    

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "Login failed. Please check your credentials.";
    throw new Error(message);
  }
};

// Signup customer
export const signupCustomer = async (data: CustomerSignupData) => {
  try {
    const response = await api.post("/customers/register", data);

    // ✅ Store token if backend sends it
    

    return response.data;
  } catch (error: any) {
    // Extract error message (backend usually sends message in response.data)
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }
};

// Get customer profile (example, token required)
export const getCustomerProfile = async (token: string) => {
  const response = await api.get('/customers/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerBarber = async (barberData: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  try {
    const response = await api.post("/barbers/register", barberData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// ✅ Barber Login
export const loginBarber = async (loginData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/barbers/login", loginData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ------------------- Service APIs -------------------

export const getservices = async (): Promise<{
  success: boolean;
  data: any[];
  message?: string;
}> => {
  try {
    const response = await api.get("/getservice");

    // normalize response
    return {
      success: response.data.success ?? false,
      data: response.data.data ?? [],
      message: response.data.message ?? "",
    };
  } catch (error: any) {
    console.error("❌ Error in getservices:", error);

    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || "Failed to fetch services",
    };
  }
};


// ------------------- Barber APIs (optional) -------------------
// export const loginBarber = async (...) => { ... }
// export const signupBarber = async (...) => { ... }

export default api;
