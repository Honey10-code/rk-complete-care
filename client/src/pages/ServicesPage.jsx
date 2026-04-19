import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Services from '../components/Services';
import { Helmet } from 'react-helmet-async';

const ServicesPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Expert Physiotherapy & Rehabilitation Services | RK The Complete Care</title>
                <meta name="description" content="Explore our specialized services including manual therapy, robotic rehab, and sports injury recovery in Jaipur." />
                <link rel="canonical" href="https://rkphysiocare.in/services" />
                <meta property="og:title" content="Expert Physiotherapy & Rehabilitation Services | RK The Complete Care" />
                <meta property="og:description" content="Explore our specialized services including manual therapy, robotic rehab, and sports injury recovery in Jaipur." />
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
