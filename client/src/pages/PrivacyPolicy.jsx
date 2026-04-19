import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect personal information that you provide to us when booking appointments, including your name, phone number, email address, and medical history relevant to your physiotherapy treatment."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your information is used to manage your appointments, provide personalized physiotherapy care, communicate treatment updates, and improve our clinical services."
    },
    {
      title: "3. Data Security",
      content: "We implement robust security measures to protect your personal data from unauthorized access, alteration, or disclosure. Your medical records are handled with the highest level of professional confidentiality."
    },
    {
      title: "4. Cookies and Tracking",
      content: "Our website may use cookies to enhance your browsing experience. These do not store personal information and are only used for site performance and analytical purposes."
    },
    {
      title: "5. Third-Party Services",
      content: "We may use third-party tools for maps (Google Maps) and analytics. These services have their own privacy policies regarding how they handle data."
    },
    {
      title: "6. Your Rights",
      content: "You have the right to access, update, or request the deletion of your personal information at any time. Please contact us directly for any such requests."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-sans">
      <Helmet>
        <title>Privacy Policy | RK The Complete Care - Your Data Security</title>
        <meta name="description" content="Learn how we protect your personal information and maintain data security at RK The Complete Care." />
        <link rel="canonical" href="https://rkphysiocare.in/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | RK The Complete Care - Your Data Security" />
        <meta property="og:description" content="Learn how we protect your personal information and maintain data security at RK The Complete Care." />
        <meta property="og:url" content="https://rkphysiocare.in/privacy-policy" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Last Updated: April 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 space-y-10"
        >
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 mb-12">
              At RK The Complete Care, your privacy is our priority. We are committed to protecting your personal data and ensuring a secure experience.
            </p>

            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black">{idx + 1}</span>
                  {section.title}
                </h2>
                <p className="text-slate-600 leading-relaxed pl-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 pt-12 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm mb-6">If you have any questions regarding this policy, please reach out to us.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="mailto:rk.completecare@gmail.com" className="text-blue-600 font-bold hover:text-blue-700 transition-all flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i> rk.completecare@gmail.com
              </a>
              <span className="hidden md:block text-slate-300">|</span>
              <Link to="/" className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
