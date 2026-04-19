import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Doctors from '../components/Doctors';
import { Helmet } from 'react-helmet-async';

const DoctorsPage = () => {
    return (
        <div className="bg-slate-900 min-h-screen">
            <Helmet>
                <title>Our Specialists | RK Total Physiotherapy Care</title>
                <meta name="description" content="Meet our expert physiotherapists at RK The Complete Care. Dr. Piyush Sharma and specialists dedicated to your recovery." />
                <link rel="canonical" href="https://rkphysiocare.in/doctors" />
                <meta property="og:title" content="Our Specialists | RK Total Physiotherapy Care" />
                <meta property="og:description" content="Meet our expert physiotherapists at RK The Complete Care. Dr. Piyush Sharma and specialists dedicated to your recovery." />
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
