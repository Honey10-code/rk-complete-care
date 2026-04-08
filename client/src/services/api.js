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

// ✅ API CACHE SYSTEM
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`🚀 API CACHE HIT: ${key}`);
    return cached.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Clean cache on mutations
const clearCache = () => cache.clear();

// ✅ APIs
export const initWakeup = () => {
    // Ping the root endpoint to wake up Render backend
    console.log("⚡ Initiating backend wakeup ping...");
    return fetch(API_URL.replace('/api', '/')).catch(() => {});
};

export const getInitialData = () => {
    const key = "/initial-data";
    const cached = getCached(key);
    if (cached) return Promise.resolve(cached);
    return api.get(key).then(res => {
        const data = res.data || {};
        setCache(key, data);
        return data;
    });
};

export const getDoctors = () => {
    const cached = getCached("/doctors");
    if (cached) return Promise.resolve(cached);
    return api.get("/doctors").then(safeArray).then(data => {
        setCache("/doctors", data);
        return data;
    });
};

export const getBanners = () => {
    const cached = getCached("/banners");
    if (cached) return Promise.resolve(cached);
    return api.get("/banners").then(safeArray).then(data => {
        setCache("/banners", data);
        return data;
    });
};

export const getTestimonials = () => {
    const cached = getCached("/testimonials");
    if (cached) return Promise.resolve(cached);
    return api.get("/testimonials").then(safeArray).then(data => {
        setCache("/testimonials", data);
        return data;
    });
};

export const getPatientStories = () => api.get("/patient-stories").then(safeArray);
export const getClinicInfo = () => {
    const cached = getCached("/clinic-info");
    if (cached) return Promise.resolve(cached);
    return api.get("/clinic-info").then(safeObject).then(data => {
        setCache("/clinic-info", data);
        return data;
    });
};
export const getClinicPosters = () => api.get("/clinic-posters").then(safeArray);
export const getServices = () => {
    const cached = getCached("/services");
    if (cached) return Promise.resolve(cached);
    return api.get("/services").then(safeArray).then(data => {
        setCache("/services", data);
        return data;
    });
};
export const getExercises = () => {
    const cached = getCached("/exercises");
    if (cached) return Promise.resolve(cached);
    return api.get("/exercises").then(safeArray).then(data => {
        setCache("/exercises", data);
        return data;
    });
};
export const getGalleryImages = () => api.get("/gallery").then(safeArray);
export const bookAppointment = (data) => api.post("/appointments", data).then(res => {
    clearCache();
    return safeObject(res);
});
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
export const updatePatientStory = (id, fd) => api.put(`/patient-stories/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(safeObject);
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

// Broadcast APIs
export const getBroadcasts = () => api.get("/broadcasts").then(safeArray);
export const postBroadcast = (data) => api.post("/broadcasts", data).then(safeObject);
export const retryBroadcast = (id) => api.post(`/broadcasts/${id}/retry`).then(safeObject);
export const deleteBroadcast = (id) => api.delete(`/broadcasts/${id}`).then(safeObject);

export default api;