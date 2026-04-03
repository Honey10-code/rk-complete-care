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
                    const bookingSection = document.getElementById('booking');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                };

                if (location.pathname === '/booking') {
                    scrollToBooking();
                } else {
                    navigate('/booking');
                    // Add a small delay to allow React Router to mount the page
                    // before attempting to scroll to the newly rendered section.
                    setTimeout(scrollToBooking, 100);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [location.pathname, navigate]);

    return null;
};

export default GlobalScroll;
