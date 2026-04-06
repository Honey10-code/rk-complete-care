import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Services from '../components/Services';
import { Helmet } from 'react-helmet-async';

const ServicesPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Physiotherapy Services | RK The Complete Care</title>
                <meta name="description" content="Explore our wide range of physiotherapy and rehabilitation services. Orthopedic rehab, sports injury management, and pain relief." />
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
