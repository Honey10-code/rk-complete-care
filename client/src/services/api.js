import axios from "axios";

// ✅ AUTO SWITCH (LOCAL + LIVE)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
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
// ✅ APIs
export const getDoctors = () => api.get("/doctors").then(safeArray);
export const getBanners = () => api.get("/banners").then(safeArray);
export const getTestimonials = () => api.get("/testimonials").then(safeArray);
export const getPatientStories = () => api.get("/patient-stories").then(safeArray);
export const getClinicInfo = () => api.get("/clinic-info").then(safeObject);
export const getClinicPosters = () => api.get("/clinic-posters").then(safeArray);
export const getServices = () => api.get("/services").then(safeArray);
export const getExercises = () => api.get("/exercises").then(safeArray);
export const getGalleryImages = () => api.get("/gallery").then(safeArray);
export const bookAppointment = (data) => api.post("/appointments", data).then(safeObject);
export const getBookedSlots = (date) => api.get(`/appointments/booked-slots?date=${date}`).then(safeObject);
export const createPaymentOrder = (data) => api.post("/payment/create-order", data).then(safeObject);
export const verifyPayment = (data) => api.post("/payment/verify", data).then(safeObject);

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

export const postGalleryImage = (fd) => api.post(`/gallery`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`).then(safeObject);

export const postService = (fd) => api.post(`/services`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const updateService = (id, fd) => api.put(`/services/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deleteService = (id) => api.delete(`/services/${id}`).then(safeObject);

export const postExercise = (fd) => api.post(`/exercises`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const updateExercise = (id, fd) => api.put(`/exercises/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
export const deleteExercise = (id) => api.delete(`/exercises/${id}`).then(safeObject);

// Contact APIs
export const submitContactMessage = (data) => api.post("/contacts", data).then(safeObject);
export const getContactMessages = () => api.get("/contacts").then(safeArray);
export const deleteContactMessage = (id) => api.delete(`/contacts/${id}`).then(safeObject);
export const markContactRead = (id) => api.patch(`/contacts/${id}/read`).then(safeObject);

// Video APIs
export const getVideos = () => api.get("/videos").then(safeArray);
export const postVideo = (data) => api.post("/videos", data).then(safeObject);
export const deleteVideo = (id) => api.delete(`/videos/${id}`).then(safeObject);

export default api;