import axios, { AxiosInstance } from "axios";
  // ✅ shared type
 


// Create an axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ this should match your Express server
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------- Types -------------------
export interface CustomerSignupData {
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | "Unisex";
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
export const loginCustomer = async (data: CustomerLoginData) => {
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
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }
};

// Get customer profile
export const getCustomerProfile = async (token: string) => {
  const response = await api.get("/customers/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ------------------- Barber APIs -------------------

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
// types/Service.ts
// src/types/Service.ts
export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
  gender: "Male" | "Female" | "Unisex";
}

// for creating new services (no _id yet)
export interface NewService {
  name: string;
  price: number;
  duration: number;
  gender: "Male" | "Female" | "Unisex";
}

// Get all services
export const getservices = async (): Promise<{
  success: boolean;
  data: Service[];
  message?: string;
}> => {
  try {
    const response = await api.get("/getservice");
    return {
      success: response.data.success ?? false,
      data: response.data.data ?? [],
      message: response.data.message ?? "",
    };
  } catch (error: any) {
    console.error("❌ Error in getServices:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch services",
    };
  }
};

// Add service
export const addService = async (service: NewService): Promise<{ success: boolean; message?: string; data?: Service }> => {
  try {
    const barberToken = localStorage.getItem("barberToken");
    if (!barberToken) throw new Error("No barber token found. Please login again.");

    const response = await api.post("/addservice", service, {
      headers: {
        Authorization: `Bearer ${barberToken}`,
      },
    });

    return response.data; // expected { success: true, data: { ...newServiceWithId } }
  } catch (error: any) {
    console.error("❌ Error adding service:", error.response?.data || error.message);
    throw error;
  }
};
// Update service
export const updateService = async (id: string, service: Service) => {
  try {
    const barberToken = localStorage.getItem("barberToken");
    if (!barberToken) throw new Error("No barber token found. Please login again.");

    const response = await api.put(`/updateservice/${id}`, service, {
      headers: {
        Authorization: `Bearer ${barberToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating service:", error.response?.data || error.message);
    throw error;
  }
};

// Delete service
export const deleteService = async (id: string) => {
  try {
    const barberToken = localStorage.getItem("barberToken");
    if (!barberToken) throw new Error("No barber token found. Please login again.");

    const response = await api.delete(`/deleteservice/${id}`, {
      headers: {
        Authorization: `Bearer ${barberToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error deleting service:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get all services based on logged-in customer's gender
 

export const getServicesByGender = async () => {
  try {
    const customerToken = localStorage.getItem("customerToken");
    const customerDataString = localStorage.getItem("customerData");

    if (!customerToken) throw new Error("No customer token found. Please login again.");
    if (!customerDataString) throw new Error("No customer data found. Please login again.");

    const customerData = JSON.parse(customerDataString); // ✅ convert string → object
    const gender = customerData.gender; // ✅ extract gender

    const response = await api.get(`/services/by-gender/${gender}`, {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching services by gender:", error.response?.data || error.message);
    throw error;
  }
};

//slot api
export const getServiceTimings = async () => {
  try {
    const customerToken = localStorage.getItem("customerToken");
    if (!customerToken) throw new Error("No customer token found. Please login again.");

    const response = await api.get("/service-timings", {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    });

    return response.data; // { success: true, data: {...} }
  } catch (error: any) {
    console.error("❌ Error fetching service timings:", error.response?.data || error.message);
    throw error;
  }
};

export const bookAppointment = async (slot: "morning" | "evening", duration: number) => {
  const customerToken = localStorage.getItem("customerToken");
  if (!customerToken) throw new Error("No customer token found");

  const response = await api.post(
    "/update-timeslot",
    { slot, duration },
    {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    }
  );

  return response.data;
};



export const bookAppointment2 = async (
  slotPeriod: string,
  totalDuration: number,
  chosenServices: { _id: string; name: string; duration: number; cost: number }[],
  timeSlot: { startTime: number; endTime: number }
) => {
  try {
    const customerToken = localStorage.getItem("customerToken");
    const customerDataString = localStorage.getItem("customerData");

    if (!customerToken || !customerDataString) {
      throw new Error("No customer data or token found. Please login again.");
    }

    const customerData = JSON.parse(customerDataString);

    const totalCost = chosenServices.reduce((sum, s) => sum + (s.cost || 0), 0);

    const payload = {
      name: customerData.first_name + " " + customerData.last_name,
      phoneNumber: customerData.phoneNumber,
      email: customerData.email,
      gender: customerData.gender,
      slotPeriod,
      timeSlot: {
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      },
      totalCost,
      services: chosenServices.map((s) => ({
        serviceId: s._id,
        name: s.name,
        price: s.cost,          // ✅ FIX: schema requires price
        duration: s.duration,
      })),
    };

    console.log("📦 Sending booking payload:", payload);

    const response = await api.post("/bookings", payload, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    console.error("❌ Book Appointment API Error:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};




export default api;
