import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'General Inquiry',
        message: ''
    });

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for form submission logic
        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
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
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                        alt="Contact Us Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary-blue/80 mix-blend-multiply"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-bold mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto"
                    >
                        We are here to help you on your road to recovery. Reach out to us for appointments, queries, or just to say hello.
                    </motion.p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 -mt-20 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Phone */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-primary-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
                            <div className="text-gray-500 mb-4 text-sm">
                                <p><strong>Mon-Sat:</strong></p>
                                <p>09:00 AM - 01:00 PM</p>
                                <p>04:00 PM - 07:00 PM</p>
                                <p className="mt-1"><strong>Sun:</strong> 10:00 AM - 2:00 PM</p>
                            </div>
                            <a href="tel:+918769556475" className="text-primary-blue font-bold text-lg hover:underline">+91 8769556475</a>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
                            <p className="text-gray-500 mb-4">For general inquiries and feedback</p>
                            <a href="mailto:rkthecompletecare@gmail.com" className="text-green-600 font-bold text-lg hover:underline">rkthecompletecare@gmail.com</a>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-orange-50 text-secondary-orange rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
                            <p className="text-gray-500 mb-4">21, Nirmal Vihar, Dadi ka Phatak, Near Kaushik School, Benad Road, Jhotwara, Jaipur</p>
                            <p className="text-secondary-orange font-bold text-lg">Detailed address below</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Form and Map Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">

                        {/* Contact Form */}
                        <div className="lg:w-1/2 p-10 lg:p-14">
                            <div className="mb-8">
                                <h4 className="text-accent-gold font-bold uppercase tracking-wider mb-2">Message Us</h4>
                                <h2 className="text-3xl font-bold text-gray-800">Send Us a Message</h2>
                                <p className="text-gray-500 mt-2">Fill out the form and our team will get back to you within 24 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Topic</label>
                                    <select
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Appointment Booking</option>
                                        <option>Home Visit Request</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/30">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Google Map */}
                        <div className="lg:w-1/2 relative bg-gray-200 min-h-[400px] lg:min-h-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.8464122193122!2d75.74185697629602!3d26.971762676611963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db368ac6c1b05%3A0xa2b27c9a29b20579!2sRK%20%E2%80%93%20The%20Complete%20Care%20Physiotherapy%20Centre!5e0!3m2!1sen!2sin!4v1771333214344!5m2!1sen!2sin"
                                className="absolute inset-0 w-full h-full"
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
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Plan Your Visit */}
                        <div className="lg:w-1/3">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <i className="fa-solid fa-map-location-dot text-primary-blue"></i>
                                Plan Your Visit
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600">
                                        <i className="fa-solid fa-square-parking text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Parking</h4>
                                        <p className="text-gray-500 text-sm">Ample street parking is available directly in front of the clinic.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600">
                                        <i className="fa-solid fa-wheelchair text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Accessibility</h4>
                                        <p className="text-gray-500 text-sm">Our facility is located on the ground floor and is fully wheelchair accessible.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600">
                                        <i className="fa-solid fa-bus text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Public Transport</h4>
                                        <p className="text-gray-500 text-sm">Located near Benad Road bus stop. E-rickshaws are easily available.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="lg:w-2/3">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <i className="fa-solid fa-circle-question text-accent-gold"></i>
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion(index)}
                                            className="w-full text-left px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="font-semibold text-gray-800">{faq.question}</span>
                                            <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}></i>
                                        </button>
                                        <AnimatePresence>
                                            {activeAccordion === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-6 py-4 bg-white text-gray-600"
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
