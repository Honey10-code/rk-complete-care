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

// ✅ API CACHE SYSTEM (Memory + LocalStorage persistence)
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours (Static data doesn't change often)
const STORAGE_PREFIX = "rkcare_cache_";

const getCached = (key, allowStale = true) => {
  // 1. Try memory
  let cached = cache.get(key);
  
  // 2. Try localStorage if memory fails
  if (!cached) {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored) {
        cached = JSON.parse(stored);
        cache.set(key, cached); // Populate memory cache
      }
    } catch (e) { console.error("Cache read error:", e); }
  }

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
  
  if (!isExpired) {
    console.log(`🚀 API CACHE HIT: ${key}`);
    return cached.data;
  }

  if (allowStale) {
    console.log(`⚠️ API CACHE STALE (SWR): ${key}`);
    return cached.data; // Return stale data but caller should refresh
  }

  return null;
};

const setCache = (key, data) => {
  const cacheObj = { data, timestamp: Date.now() };
  cache.set(key, cacheObj);
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(cacheObj));
  } catch (e) { console.error("Cache write error:", e); }
};

// Clean cache on mutations
const clearCache = () => {
    cache.clear();
    try {
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
        });
    } catch (e) { }
};

// ✅ APIs
export const initWakeup = () => {
    // Ping both root and api to ensure full stack is awake
    const ping = (url) => fetch(url, { mode: 'no-cors' }).catch(() => {});
    console.log("⚡ Initiating backend wakeup pings...");
    ping(API_URL.replace('/api', '/'));
    ping(API_URL + "/initial-data");
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
export const patchAppointment = (id, data) => api.patch(`/appointments/${id}`, data).then(res => { clearCache(); return safeObject(res); });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postDoctor = (fd) => api.post(`/doctors`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postTestimonial = (data) => api.post(`/testimonials`, data).then(res => { clearCache(); return safeObject(res); });
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postClinicInfo = (data) => api.post(`/clinic-info`, data).then(res => { clearCache(); return safeObject(res); });

export const postBanner = (fd) => api.post(`/banners`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deleteBanner = (id) => api.delete(`/banners/${id}`).then(res => { clearCache(); return safeObject(res); });
export const reorderBanners = (bannerIds) => api.patch(`/banners/reorder`, { bannerIds }).then(res => { clearCache(); return res.data; });

export const postPatientStory = (fd) => api.post(`/patient-stories`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const updatePatientStory = (id, fd) => api.put(`/patient-stories/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deletePatientStory = (id) => api.delete(`/patient-stories/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postClinicPoster = (fd) => api.post(`/clinic-posters`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deleteClinicPoster = (id) => api.delete(`/clinic-posters/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postGalleryImage = (fd) => api.post(`/gallery`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postService = (fd) => api.post(`/services`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const updateService = (id, fd) => api.put(`/services/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deleteService = (id) => api.delete(`/services/${id}`).then(res => { clearCache(); return safeObject(res); });

export const postExercise = (fd) => api.post(`/exercises`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const updateExercise = (id, fd) => api.put(`/exercises/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => { clearCache(); return safeObject(res); });
export const deleteExercise = (id) => api.delete(`/exercises/${id}`).then(res => { clearCache(); return safeObject(res); });

// Contact APIs
export const submitContactMessage = (data) => api.post("/contacts", data).then(safeObject);
export const getContactMessages = () => api.get("/contacts").then(safeArray);
export const deleteContactMessage = (id) => api.delete(`/contacts/${id}`).then(res => { clearCache(); return safeObject(res); });
export const markContactRead = (id) => api.patch(`/contacts/${id}/read`).then(res => { clearCache(); return safeObject(res); });

// Video APIs
export const getVideos = () => api.get("/videos").then(safeArray);
export const postVideo = (data) => api.post("/videos", data).then(safeObject);
export const deleteVideo = (id) => api.delete(`/videos/${id}`).then(res => { clearCache(); return safeObject(res); });

export default api;