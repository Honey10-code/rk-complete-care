import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the website."
    },
    {
      title: "2. Description of Services",
      content: "RK The Complete Care provides physiotherapy services, appointment booking, and wellness resources. We reserve the right to modify or discontinue any service at our discretion."
    },
    {
      title: "3. Appointments and Cancellations",
      content: "Appointments booked through the website are subject to confirmation by the clinic. We request at least 24 hours notice for any cancellations or rescheduling to help us manage patient flow effectively."
    },
    {
      title: "4. User Responsibilities",
      content: "You agree to provide accurate information when booking an appointment. You are responsible for maintaining the confidentiality of any account details used on the site."
    },
    {
      title: "5. Intellectual Property",
      content: "All content on this website, including text, graphics, and logos, is the property of RK The Complete Care and is protected by copyright laws."
    },
    {
      title: "6. Limitation of Liability",
      content: "RK The Complete Care shall not be liable for any indirect or consequential damages arising from the use of this website or our clinical services beyond the scope of professional malpractice insurance."
    },
    {
      title: "7. Governing Law",
      content: "These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-sans">
      <Helmet>
        <title>Terms of Service | RK The Complete Care - Legal Guidelines</title>
        <meta name="description" content="Review the terms and conditions for using our services and website for RK The Complete Care." />
        <link rel="canonical" href="https://rkphysiocare.in/terms-of-service" />
        <meta property="og:title" content="Terms of Service | RK The Complete Care - Legal Guidelines" />
        <meta property="og:description" content="Review the terms and conditions for using our services and website for RK The Complete Care." />
        <meta property="og:url" content="https://rkphysiocare.in/terms-of-service" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Effective Date: April 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 space-y-10"
        >
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-6 mb-12">
              Please read these terms carefully before using our services. Your continued use of the RK The Complete Care website constitutes acceptance of these terms.
            </p>

            {terms.map((term, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black">{idx + 1}</span>
                  {term.title}
                </h2>
                <p className="text-slate-600 leading-relaxed pl-11">
                  {term.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <div className="mt-16 pt-12 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm mb-6">By using our services, you acknowledge that you have read and understood these Terms of Service.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/" className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                Go Back Home
              </Link>
              <Link to="/contact" className="px-8 py-3 rounded-full border border-slate-200 text-slate-800 font-bold hover:bg-slate-50 transition-all active:scale-95">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
