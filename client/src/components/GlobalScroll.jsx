import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GlobalScroll = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClick = (e) => {
            const btn = e.target.closest('.book-btn');
            if (btn) {
                e.preventDefault();

                const scrollToBooking = () => {
                    const bookingSection = document.getElementById('book-appointment');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                };

                if (location.pathname === '/' || location.pathname === '/home') {
                    scrollToBooking();
                } else {
                    navigate('/');
                    // Wait for navigation to complete before scrolling
                    setTimeout(scrollToBooking, 100);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [location.pathname, navigate]);

    // Handle universal hash scrolling
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const scrollWithRetry = (retries = 3) => {
                const el = document.getElementById(id);
                if (el) {
                    setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
                } else if (retries > 0) {
                    setTimeout(() => scrollWithRetry(retries - 1), 200);
                }
            };
            scrollWithRetry();
        }
    }, [location]);

    return null;
};

export default GlobalScroll;
