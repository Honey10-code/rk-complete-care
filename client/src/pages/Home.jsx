import React, { Suspense, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Exercises from '../components/Exercises';
import { motion, useReducedMotion } from 'framer-motion';
import BannerCarousel from '../components/BannerCarousel';
import { getInitialData } from '../services/api';

// ─── Lazy load below-the-fold components ────────────────────────────────────
const Testimonials  = React.lazy(() => import('../components/Testimonials'));
const BookingSection = React.lazy(() => import('../components/BookingSection'));
const Contact       = React.lazy(() => import('../components/Contact'));
const Footer        = React.lazy(() => import('../components/Footer'));

// ─── Constants (moved outside to avoid re-creation on every render) ──────────
const STATS = [
    { value: '500+', label: 'Patients Treated', icon: 'fa-users',        color: 'blue'    },
    { value: '7+',   label: 'Years Experience', icon: 'fa-award',        color: 'indigo'  },
    { value: '98%',  label: 'Recovery Rate',    icon: 'fa-heart-pulse',  color: 'emerald' },
    { value: '4.9★', label: 'Google Rating',    icon: 'fa-star',         color: 'amber'   },
];

const FEATURE_CARDS = [
    {
        to:          '/services',
        icon:        'fa-hand-holding-medical',
        color:       'blue',
        title:       'Elite Services',
        description: 'Advanced orthopedic rehab and personalized therapy plans for holistic healing.',
        cta:         'Explore',
    },
    {
        to:          '/doctors',
        icon:        'fa-user-doctor',
        color:       'indigo',
        title:       'Lead Specialists',
        description: 'Meet Dr. Piyush Sharma and Dr. Soniya Pathak — our dedicated expert team of clinical therapists.',
        cta:         'Meet Experts',
    },
    {
        to:          '/exercises',
        icon:        'fa-person-running',
        color:       'emerald',
        title:       'Recovery Support',
        description: 'Access clinical exercise protocols and guides designed specially for your recovery.',
        cta:         'View Guides',
    },
];

const COLOR_MAP = {
    blue:    { bg: 'bg-blue-50',    hover: 'group-hover:bg-blue-600',    icon: 'text-blue-700',   iconHover: 'group-hover:from-blue-600 group-hover:to-blue-800',   link: 'text-blue-700',   linkHover: 'group-hover:bg-blue-50'   },
    indigo:  { bg: 'bg-indigo-50',  hover: 'group-hover:bg-indigo-600',  icon: 'text-indigo-700', iconHover: 'group-hover:from-indigo-600 group-hover:to-indigo-800', link: 'text-indigo-700', linkHover: 'group-hover:bg-indigo-50' },
    emerald: { bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-500', icon: 'text-emerald-600',iconHover: 'group-hover:from-emerald-500 group-hover:to-emerald-600',link: 'text-emerald-600',linkHover: 'group-hover:bg-emerald-50'},
    amber:   { bg: 'bg-amber-50',   hover: 'group-hover:bg-amber-500',   icon: 'text-amber-600',  iconHover: 'group-hover:from-amber-500 group-hover:to-amber-600',   link: 'text-amber-600',  linkHover: 'group-hover:bg-amber-50'  },
};

// ─── Reusable sub-components ─────────────────────────────────────────────────

/** Accessible loading spinner shown while lazy sections load */
const SectionLoader = () => (
    <div
        className="py-20 flex justify-center items-center"
        role="status"
        aria-label="Loading section…"
    >
        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <span className="sr-only">Loading…</span>
    </div>
);

/** Single stat card */
const StatCard = ({ value, label, icon, shouldReduceMotion }) => (
    <motion.div
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        className="flex flex-col items-center text-center px-4"
    >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-600 text-xl mb-4 shadow-inner border border-white">
            <i className={`fa-solid ${icon}`} aria-hidden="true" />
        </div>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-1.5">{label}</p>
    </motion.div>
);

/** Single feature card */
const FeatureCard = ({ to, icon, color, title, description, cta, shouldReduceMotion }) => {
    const c = COLOR_MAP[color];
    return (
        <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -10 }}
            className="bg-white p-10 rounded-[2rem] border border-slate-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center text-center group transition-all duration-500 relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} rounded-bl-[100px] -z-10 transition-all duration-500 ${c.hover}`} aria-hidden="true" />
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${color}-100 to-${color}-50 flex items-center justify-center ${c.icon} text-2xl mb-8 group-hover:scale-110 group-hover:text-white ${c.iconHover} transition-all duration-500 shadow-sm border border-white`}>
                <i className={`fa-solid ${icon}`} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">{description}</p>
            <Link
                to={to}
                aria-label={`${cta} – ${title}`}
                className={`mt-auto px-6 py-2.5 rounded-full bg-slate-50 ${c.linkHover} ${c.link} font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
            >
                {cta} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
        </motion.div>
    );
};

// ─── JSON-LD schema (static string, defined once) ────────────────────────────
const SCHEMA_JSON = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',          // ✅ Fixed: was "Physiotherapy Center" (not a valid type)
    name: 'RK The Complete Care',
    image: 'https://rkphysiocare.in/assets/images/LOGO.png',
    '@id': 'https://rkphysiocare.in',
    url: 'https://rkphysiocare.in',
    telephone: '+91-8769556475',
    priceRange: '₹₹',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '21, Nirmal Vihar, Dadi ka Phatak, Benad Road, Jhotwara',
        addressLocality: 'Jaipur',
        postalCode: '302012',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 26.9717627,
        longitude: 75.741857,
    },
    openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '20:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:00', closes: '12:00' },
    ],
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Physiotherapy Services',
        itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Orthopedic Rehabilitation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Manual Therapy' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Robotic Rehab' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sports Injury Recovery' } },
        ],
    },
    sameAs: [
        'https://www.facebook.com/rkcompletecare',
        'https://www.instagram.com/rkcompletecare',
    ],
});

// ─── Main component ───────────────────────────────────────────────────────────
const Home = () => {
    // ✅ Respect OS-level "Reduce Motion" preference
    const shouldReduceMotion = useReducedMotion();

    // ✅ Memoize animation variants to avoid object re-creation each render
    const fadeUp = useMemo(() => ({
        hidden:  { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    }), [shouldReduceMotion]);

    // ✅ Stable scroll handler with useCallback
    const scrollToBooking = useCallback((e) => {
        const el = document.getElementById('book-appointment');
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
        }
    }, [shouldReduceMotion]);

    useEffect(() => {
        getInitialData().catch((err) => console.error('Home pre-fetch error:', err));
    }, []);

    return (
        <>
            {/* ── Skip-to-content link (a11y) ── */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-bold"
            >
                Skip to main content
            </a>

            <Helmet>
                <title>Best Physiotherapy Center in Jaipur | RK The Complete Care</title>
                <meta name="description" content="Expert physiotherapy, orthopedic rehabilitation, and chiropractic care in Jaipur. Dr. Piyush Sharma provides personalized recovery plans." />
                <meta name="keywords" content="physiotherapy jaipur, orthopedic doctor, chiropractor, back pain treatment, knee replacement rehab, sports injury, jhotwara physio" />
                <link rel="canonical" href="https://rkphysiocare.in/" />
                {/* ✅ Preconnect to image CDN for faster LCP */}
                <link rel="preconnect" href="https://images.unsplash.com" />
                <script type="application/ld+json">{SCHEMA_JSON}</script>
                <meta property="og:title"       content="Best Physiotherapy Center in Jaipur | RK The Complete Care" />
                <meta property="og:description" content="Expert physiotherapy, orthopedic rehabilitation, and chiropractic care in Jaipur." />
                <meta property="og:url"         content="https://rkphysiocare.in/" />
                <meta property="og:type"        content="website" />
                <meta property="og:image"       content="https://rkphysiocare.in/assets/images/LOGO.png" />
                {/* ✅ Twitter card */}
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content="Best Physiotherapy Center in Jaipur | RK The Complete Care" />
                <meta name="twitter:description" content="Expert physiotherapy & orthopedic rehab in Jaipur." />
            </Helmet>

            <Navbar />

            <main id="main-content">

                {/* ── Banner ── */}
                <BannerCarousel />

                {/* ── Hero / Clinic Introduction ── */}
                <section
                    aria-labelledby="hero-heading"
                    className="relative min-h-[90vh] flex items-center overflow-hidden bg-white"
                >
                    {/* Decorative background – aria-hidden so screen readers skip it */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white" aria-hidden="true">
                        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-slate-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    </div>

                    <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

                            {/* Left column */}
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-100px' }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.07)] mb-8"
                                >
                                    <div className="relative w-9 h-9 rounded-full bg-white border border-blue-100 shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                                        <img
                                            src="/logo.png"
                                            alt="RK The Complete Care logo"
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    {/* ✅ aria-hidden on purely decorative pulse dot */}
                                    <span className="relative flex h-2 w-2" aria-hidden="true">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                                    </span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">Jaipur's Premier Clinic</span>
                                </motion.div>

                                {/* ✅ Proper h1 with id for aria-labelledby */}
                                <h1
                                    id="hero-heading"
                                    className="text-slate-900 leading-[1.1] mb-6 font-black tracking-tight"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    <span className="block text-4xl md:text-5xl lg:text-[3.5rem] text-slate-400 font-extrabold pb-2">Welcome to</span>
                                    <span className="block text-4xl md:text-5xl lg:text-[3.5rem] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 pb-2">
                                        RK The Complete Care
                                    </span>
                                    <span className="block text-3xl md:text-5xl lg:text-[3.5rem] text-blue-700 mt-1">
                                        Physiotherapy Centre
                                    </span>
                                    <span className="block text-2xl md:text-2xl lg:text-[2.5rem] text-blue-600 mt-1 font-bold">
                                        Where Recovery Begins…
                                    </span>
                                </h1>

                                <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 max-w-lg leading-relaxed">
                                    Experience world-class physiotherapy. We integrate advanced clinical protocols with compassionate, tailored treatment to accelerate your healing journey.
                                </p>

                                <div className="flex flex-wrap items-center gap-5">
                                    <a
                                        href="#book-appointment"
                                        onClick={scrollToBooking}
                                        aria-label="Book a consultation appointment"
                                        className="book-btn px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-[15px] flex items-center gap-3 transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_8px_25px_rgba(29,78,216,0.25)] hover:-translate-y-1 transform group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    >
                                        <i className="fa-solid fa-calendar-check text-blue-400 group-hover:text-white transition-colors" aria-hidden="true" />
                                        Book Consultation
                                    </a>
                                    <a
                                        href="#services"
                                        aria-label="View our physiotherapy services"
                                        className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-[15px] hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all duration-300 flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    >
                                        Our Services <i className="fa-solid fa-arrow-right text-slate-400 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                                    </a>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-center gap-4">
                                    {/* ✅ Images have descriptive alt text */}
                                    <div className="flex -space-x-3" aria-label="Collage of happy patients">
                                        <img className="w-10 h-10 rounded-full border-2 border-white object-cover" loading="lazy" width={40} height={40} src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" alt="Satisfied patient" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white object-cover" loading="lazy" width={40} height={40} src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="Satisfied patient" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white object-cover" loading="lazy" width={40} height={40} src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Satisfied patient" />
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-700" aria-label="500 or more additional patients">5k+</div>
                                    </div>
                                    <div className="text-center sm:text-left text-sm text-slate-500 font-semibold">
                                        {/* ✅ Stars: aria-label conveys rating; icons are decorative */}
                                        <div className="flex items-center justify-center sm:justify-start text-amber-400 text-[13px] gap-0.5 mb-0.5" aria-label="5 out of 5 stars">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="fa-solid fa-star" aria-hidden="true" />
                                            ))}
                                        </div>
                                        <p className="mb-0.5 flex items-center justify-center sm:justify-start gap-2">
                                            Trusted by <span className="text-slate-800">500+</span> Patients
                                        </p>
                                        <a
                                            href="mailto:rk.completecare@gmail.com"
                                            aria-label="Email us at rk.completecare@gmail.com"
                                            className="text-[10px] text-blue-600 font-bold hover:text-blue-700 transition-colors tracking-tight flex items-center justify-center sm:justify-start gap-1.5 px-2 py-0.5 bg-blue-50/50 rounded-full w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                        >
                                            <i className="fa-solid fa-envelope text-[9px]" aria-hidden="true" />
                                            rk.completecare@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right column – hero image */}
                            <motion.div
                                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[8px] border-white z-10 w-full aspect-[4/5] md:aspect-auto md:h-[600px]">
                                    {/* ✅ fetchpriority="high" + eager loading for LCP image */}
                                    <img
                                        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                                        alt="Physiotherapist treating a patient at RK The Complete Care"
                                        fetchpriority="high"
                                        loading="eager"
                                        width={800}
                                        height={600}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[1.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" aria-hidden="true" />
                                </div>

                                <div className="absolute top-10 -right-6 w-24 h-24 bg-[radial-gradient(circle,_rgba(226,232,240,1)_1px,_transparent_1px)] bg-[length:8px_8px] -z-10" aria-hidden="true" />
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10 blur-xl" aria-hidden="true" />

                                {/* Stats badge */}
                                <motion.div
                                    initial={{ y: shouldReduceMotion ? 0 : 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="absolute bottom-8 -left-4 md:-left-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 md:p-6 border border-white z-20 flex gap-6"
                                    aria-label="Quick stats: 98% recovery rate, 500+ happy patients"
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm" aria-hidden="true">
                                                <i className="fa-solid fa-ranking-star" />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-tight">Recovery<br />Rate</p>
                                        </div>
                                        <p className="font-black text-slate-900 text-3xl">98<span className="text-blue-600 text-xl">%</span></p>
                                    </div>
                                    <div className="w-px bg-slate-200" aria-hidden="true" />
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm" aria-hidden="true">
                                                <i className="fa-solid fa-clock-rotate-left" />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-tight">Happy<br />Patients</p>
                                        </div>
                                        <p className="font-black text-slate-900 text-3xl">500<span className="text-blue-600 text-xl">+</span></p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Stats row */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="mt-20 relative"
                        >
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80" aria-hidden="true" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 relative z-10 divide-x divide-slate-100">
                                {STATS.map((stat) => (
                                    <StatCard
                                        key={stat.label}
                                        {...stat}
                                        shouldReduceMotion={shouldReduceMotion}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400/50 flex flex-col items-center gap-2"
                        aria-hidden="true"
                    >
                        <span className="text-[10px] uppercase font-bold tracking-widest">Scroll</span>
                        <i className="fa-solid fa-chevron-down text-sm" />
                    </motion.div>
                </section>

                {/* ── Feature cards ── */}
                <section
                    aria-labelledby="features-heading"
                    className="py-24 bg-slate-50 border-b border-slate-100 relative"
                >
                    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" aria-hidden="true" />
                    {/* ✅ Visually hidden heading for screen-reader landmark */}
                    <h2 id="features-heading" className="sr-only">Our Key Offerings</h2>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-3 gap-8">
                            {FEATURE_CARDS.map((card) => (
                                <FeatureCard
                                    key={card.title}
                                    {...card}
                                    shouldReduceMotion={shouldReduceMotion}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Services ── */}
                <section
                    id="services"
                    aria-labelledby="services-heading"
                    className="py-24 bg-slate-50 relative overflow-hidden"
                >
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">Professional Treatments · व्यावसायिक उपचार</div>
                            <h2 id="services-heading" className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                                Specialized Clinical <span className="text-blue-700">Services</span>
                            </h2>
                            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                                Expert physiotherapy and rehabilitation for orthopaedic and sports recovery.
                            </p>
                        </div>
                        <Services limit={6} isHomePage={true} />
                        <div className="mt-16 text-center">
                            <Link
                                to="/services"
                                aria-label="Explore all physiotherapy services"
                                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 inline-flex items-center"
                            >
                                Explore All Services <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Exercises ── */}
                <section
                    aria-labelledby="exercises-heading"
                    className="py-24 bg-white relative overflow-hidden"
                >
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">Home Rehabilitation · घर पर पुनर्वास</div>
                            <h2 id="exercises-heading" className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                                Featured Clinical <span className="text-blue-700">Recovery Guides</span>
                            </h2>
                            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                                Access our most effective home-based protocols designed by top physiotherapists.
                            </p>
                        </div>
                        <Exercises limit={4} isHomePage={true} />
                        <div className="mt-16 text-center">
                            <Link
                                to="/exercises"
                                aria-label="Explore all exercise recovery guides"
                                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 inline-flex items-center"
                            >
                                Explore All Exercises <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Lazy sections ── */}
                <Suspense fallback={<SectionLoader />}>
                    <Testimonials />
                    <BookingSection />
                    <Contact />
                    <Footer />
                </Suspense>

            </main>
        </>
    );
};

export default Home;