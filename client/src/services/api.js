import axios from "axios";

const API_BASE_URL = "https://rk-complete-care-api.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getDoctors = () => api.get("/doctors").then(res => res.data);
export const getBanners = () => api.get("/banners").then(res => res.data);
export const getTestimonials = () => api.get("/testimonials").then(res => res.data);
export const getPatientStories = () => api.get("/patient-stories").then(res => res.data);
export const getClinicInfo = () => api.get("/clinic-info").then(res => res.data);
export const getClinicPosters = () => api.get("/clinic-posters").then(res => res.data);

export default api;
