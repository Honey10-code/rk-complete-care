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

// Administrative APIs
export const getAppointments = (search = "") => api.get(`/appointments?search=${search}`).then(safeArray);
export const patchAppointment = (id, data) => api.patch(`/appointments/${id}`, data).then(safeObject);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`).then(safeObject);

export const postDoctor = (fd) => api.post(`/doctors`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`).then(safeObject);

export const postTestimonial = (data) => api.post(`/testimonials`, data).then(safeObject);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`).then(safeObject);

export const postClinicInfo = (data) => api.post(`/clinic-info`, data).then(safeObject);

export const postBanner = (fd) => api.post(`/banners`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deleteBanner = (id) => api.delete(`/banners/${id}`).then(safeObject);

export const postPatientStory = (fd) => api.post(`/patient-stories`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deletePatientStory = (id) => api.delete(`/patient-stories/${id}`).then(safeObject);

export const postClinicPoster = (fd) => api.post(`/clinic-posters`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deleteClinicPoster = (id) => api.delete(`/clinic-posters/${id}`).then(safeObject);

export default api;