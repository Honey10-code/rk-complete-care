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

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-text-dark font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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

