import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Doctors from '../components/Doctors';
import { Helmet } from 'react-helmet-async';

const DoctorsPage = () => {
    return (
        <div className="bg-slate-900 min-h-screen">
            <Helmet>
                <title>Our Doctors | RK The Complete Care Jaipur</title>
                <meta name="description" content="Meet experienced physiotherapy specialists at RK The Complete Care Jaipur for expert recovery and pain treatment." />
                <link rel="canonical" href="https://rkphysiocare.in/doctors" />
                <meta property="og:title" content="Our Doctors | RK The Complete Care Jaipur" />
                <meta property="og:description" content="Meet experienced physiotherapy specialists at RK The Complete Care Jaipur for expert recovery and pain treatment." />
                <meta property="og:url" content="https://rkphysiocare.in/doctors" />
            </Helmet>
            <Navbar />
            <div>
                <Doctors />
            </div>
            <Footer />
        </div>
    );
};

export default DoctorsPage;
