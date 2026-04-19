import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Doctors from '../components/Doctors';
import { Helmet } from 'react-helmet-async';

const DoctorsPage = () => {
    return (
        <div className="bg-slate-900 min-h-screen">
            <Helmet>
                <title>Meet Our Expert Medical Team | RK Total Physiotherapy Care</title>
                <meta name="description" content="Our team of dedicated physiotherapists and specialists are committed to your rapid recovery and long-term health." />
                <link rel="canonical" href="https://rkphysiocare.in/doctors" />
                <meta property="og:title" content="Meet Our Expert Medical Team | RK Total Physiotherapy Care" />
                <meta property="og:description" content="Our team of dedicated physiotherapists and specialists are committed to your rapid recovery and long-term health." />
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
