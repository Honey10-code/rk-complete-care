import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContactMessage } from '../services/api';

const Contact = () => {
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'General Inquiry',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            await submitContactMessage(formData);
            setSubmitStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            setFormData({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
            // Hide notification after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    const faqs = [
        {
            question: "Do I need a doctor's referral for physiotherapy?",
            answer: "No, you do not strictly need a doctor's referral to visit us. However, if you are claiming insurance, some providers may require one. We recommend checking with your insurance provider."
        },
        {
            question: "What should I wear to my appointment?",
            answer: "Please wear loose, comfortable clothing that allows easy movement and access to the area being treated. Sportswear or gym attire is usually best."
        },
        {
            question: "How long does a typical session last?",
            answer: "Initial assessments usually take 45-60 minutes. Follow-up treatment sessions typically last between 30 to 45 minutes, depending on your treatment plan."
        },
        {
            question: "Do you offer home visits?",
            answer: "Yes, we offer home physiotherapy sessions for patients who are unable to visit the clinic. Please contact us directly to schedule a home visit."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 bg-slate-900 border-b-4 border-blue-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                        alt="Contact Us Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="section-badge mx-auto bg-blue-900/50 border-blue-700 text-blue-400">Contact Us</div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-white mt-4 mb-6"
                    >
                        Get in <span className="text-blue-500">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium"
                    >
                        We are here to help you on your road to recovery. Reach out to us for appointments, queries, or expert guidance.
                    </motion.p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 -mt-12 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Phone */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Call Us</h3>
                            <div className="text-slate-500 mb-4 text-sm font-medium">
                                <p>Mon-Sat: 09:00 AM - 07:00 PM</p>
                                <p>Sun: 10:00 AM - 02:00 PM</p>
                            </div>
                            <a href="tel:+918769556475" className="text-blue-700 font-black text-lg hover:text-blue-800">+91 8769556475</a>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Email Us</h3>
                            <p className="text-slate-500 mb-4 font-medium">For general inquiries and feedback</p>
                            <a href="mailto:rkthecompletecare@gmail.com" className="text-blue-600 font-black text-base hover:text-blue-700 break-all">rkthecompletecare@gmail.com</a>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Visit Us</h3>
                            <p className="text-slate-500 mb-2 text-sm font-medium leading-relaxed">
                                21, Nirmal Vihar, Dadi ka Phatak, Near Kaushik School, Benad Road, Jhotwara, Jaipur
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Form and Map Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 grid lg:grid-cols-2">
                        {/* Contact Form */}
                        <div className="p-10 lg:p-14 border-r border-slate-100">
                            <div className="mb-10">
                                <div className="section-badge mb-4">Send a Message</div>
                                <h2 className="text-3xl font-black text-slate-900">How Can <span className="text-blue-700">We Help?</span></h2>
                                <p className="text-slate-500 mt-3 font-medium">Fill out the form and our team will get back to you shortly.</p>
                            </div>

                            {submitStatus && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${submitStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                    <i className={`fa-solid ${submitStatus.type === 'success' ? 'fa-circle-check text-emerald-500' : 'fa-circle-exclamation text-rose-500'}`}></i>
                                    <span className="font-bold">{submitStatus.message}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Reason for Contact</label>
                                    <select
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Appointment Booking</option>
                                        <option>Home Visit Request</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="form-input"
                                        placeholder="Tell us what you need help with..."
                                    ></textarea>
                                </div>
                                <button disabled={isSubmitting} type="submit" className="btn btn-primary w-full py-4 text-base font-black shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Sending...' : 'Send Message Now'}
                                </button>
                            </form>
                        </div>

                        {/* Google Map */}
                        <div className="relative bg-slate-100 min-h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.8464122193122!2d75.74185697629602!3d26.971762676611963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db368ac6c1b05%3A0xa2b27c9a29b20579!2sRK%20%E2%80%93%20The%20Complete%20Care%20Physiotherapy%20Centre!5e0!3m2!1sen!2sin!4v1771333214344!5m2!1sen!2sin"
                                className="absolute inset-0 w-full h-full grayscale-[0.2]"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="RK The Complete Care Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plan Your Visit & FAQ Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Plan Your Visit */}
                        <div className="lg:w-1/3">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <i className="fa-solid fa-map-location-dot text-blue-700"></i>
                                Plan Your Visit
                            </h3>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-700 text-xl font-bold">
                                        <i className="fa-solid fa-square-parking"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Parking</h4>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Ample street parking is available directly in front of the clinic.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 text-xl font-bold">
                                        <i className="fa-solid fa-wheelchair"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Accessibility</h4>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Our facility is ground-floor located and fully wheelchair accessible.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-500 text-xl font-bold">
                                        <i className="fa-solid fa-bus"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Public Transport</h4>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Located near Benad Road bus stop. E-rickshaws are easily available.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="lg:w-2/3">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <i className="fa-solid fa-circle-question text-blue-700"></i>
                                FAQ
                            </h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => toggleAccordion(index)}
                                            className="w-full text-left px-6 py-5 flex justify-between items-center bg-slate-50 hover:bg-slate-100/50 transition-colors"
                                        >
                                            <span className="font-bold text-slate-800">{faq.question}</span>
                                            <i className={`fa-solid fa-chevron-down text-blue-700 transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}></i>
                                        </button>
                                        <AnimatePresence>
                                            {activeAccordion === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-6 py-5 bg-white text-slate-600 leading-relaxed font-medium"
                                                >
                                                    {faq.answer}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
