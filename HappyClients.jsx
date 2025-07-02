import React, { useEffect } from 'react';
import './HappyClients.css';

const HappyClients = () => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.client-card');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const clients = [
        {
            name: "John Doe",
            comment: "The flavors are incredible! Every dish is a delightful experience. Fast delivery and great packaging.",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5
        },
        {
            name: "Sarah Wilson",
            comment: "Perfect every time! The subscription service has made my life so much easier. Love the variety!",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            rating: 5
        },
        {
            name: "Mike Johnson",
            comment: "Best food delivery service in town. The quality and consistency are outstanding!",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            rating: 4
        }
    ];

    return (
        <div className="happy-clients-section">
            <h2>Happy Clients</h2>
            <p className="subtitle">What our customers say about their experience with us</p>
            <div className="clients-container">
                {clients.map((client, index) => (
                    <div key={index} className="client-card">
                        <div className="client-image">
                            <img src={client.image} alt={client.name} />
                        </div>
                        <div className="client-info">
                            <h3>{client.name}</h3>
                            <div className="rating">
                                {[...Array(client.rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>
                            <p>{client.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HappyClients;
