import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Services from '../components/Services';
import { Helmet } from 'react-helmet-async';

const ServicesPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Physiotherapy Services in Jaipur | RK The Complete Care</title>
                <meta name="description" content="Back pain, knee pain, sports injury rehab, posture correction and expert physiotherapy services in Jaipur." />
                <link rel="canonical" href="https://rkphysiocare.in/services" />
                <meta property="og:title" content="Physiotherapy Services in Jaipur | RK The Complete Care" />
                <meta property="og:description" content="Back pain, knee pain, sports injury rehab, posture correction and expert physiotherapy services in Jaipur." />
                <meta property="og:url" content="https://rkphysiocare.in/services" />
            </Helmet>
            <Navbar />
            <div className="pt-4 pb-12">
                <Services />
            </div>
            <Footer />
        </div>
    );
};

export default ServicesPage;
