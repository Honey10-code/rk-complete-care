import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Exercises from '../components/Exercises';
import { Helmet } from 'react-helmet-async';

const ExercisesPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Exercise Guides | RK The Complete Care</title>
                <meta name="description" content="Access our specialized exercise guides for orthopedic rehabilitation and general pain relief. Dr. Piyush Sharma's recovery protocols." />
            </Helmet>
            <Navbar />
            <div className="pt-4 pb-12">
                <Exercises />
            </div>
            <Footer />
        </div>
    );
};

export default ExercisesPage;
