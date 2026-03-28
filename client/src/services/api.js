import axios from "axios";

// ✅ AUTO SWITCH (LOCAL + LIVE)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// ✅ TOKEN INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ SAFE RESPONSE HANDLERS
const safeArray = (res) => {
  console.log("API DATA (Array):", res.data);
  return Array.isArray(res.data) ? res.data : [];
};

const safeObject = (res) => {
  console.log("API DATA (Object):", res.data);
  return res.data || {};
};

// ✅ APIs
export const getDoctors = () => api.get("/doctors").then(safeArray);
export const getBanners = () => api.get("/banners").then(safeArray);
export const getTestimonials = () => api.get("/testimonials").then(safeArray);
export const getPatientStories = () => api.get("/patient-stories").then(safeArray);
export const getClinicInfo = () => api.get("/clinic-info").then(safeObject);
export const getClinicPosters = () => api.get("/clinic-posters").then(safeArray);
export const bookAppointment = (data) => api.post("/appointments", data).then(safeObject);
export const getBookedSlots = (date) => api.get(`/appointments/booked-slots?date=${date}`).then(safeArray);

export default api;