import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import PatientStories from './pages/PatientStories';
import ClinicPosters from './pages/ClinicPosters';

import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import ExercisesPage from './pages/ExercisesPage';
import GalleryPage from './pages/GalleryPage';

import ProtectedRoute from './components/ProtectedRoute';
import GlobalScroll from './components/GlobalScroll';

function App() {
  return (
    <Router>
      <GlobalScroll />
      <div className="min-h-screen text-text-dark font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/booking" element={<Booking />} />
          <Route path="/patient-stories" element={<PatientStories />} />
          <Route path="/clinic-posters" element={<ClinicPosters />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;