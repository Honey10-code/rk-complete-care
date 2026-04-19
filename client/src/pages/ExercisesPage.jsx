import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Exercises from '../components/Exercises';
import { Helmet } from 'react-helmet-async';

const ExercisesPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Recovery Exercise Guides & Protocols | RK The Complete Care</title>
                <meta name="description" content="Access expert-designed exercise guides for spine recovery, joint health, and post-surgery rehabilitation." />
                <link rel="canonical" href="https://rkphysiocare.in/exercises" />
                <meta property="og:title" content="Recovery Exercise Guides & Protocols | RK The Complete Care" />
                <meta property="og:description" content="Access expert-designed exercise guides for spine recovery, joint health, and post-surgery rehabilitation." />
                <meta property="og:url" content="https://rkphysiocare.in/exercises" />
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
