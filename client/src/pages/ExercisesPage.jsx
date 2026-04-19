import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Exercises from '../components/Exercises';
import { Helmet } from 'react-helmet-async';

const ExercisesPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Physiotherapy Exercises | RK The Complete Care Jaipur</title>
                <meta name="description" content="Guided physiotherapy exercises for back pain, knee pain, posture and recovery by RK The Complete Care Jaipur." />
                <link rel="canonical" href="https://rkphysiocare.in/exercises" />
                <meta property="og:title" content="Physiotherapy Exercises | RK The Complete Care Jaipur" />
                <meta property="og:description" content="Guided physiotherapy exercises for back pain, knee pain, posture and recovery by RK The Complete Care Jaipur." />
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
