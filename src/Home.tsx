import React from 'react';
import './styles/Home.css';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Elevate Your <span className="highlight">Smash</span> Game</h1>
                    <p className="hero-subtitle">
                        Track tournaments, analyze performance, and master your mains with the ultimate Smash Bros. companion.
                    </p>
                    <div className="hero-actions">
                        <button className="cta-button primary" onClick={() => navigate('/tournaments')}>
                            Find Tournaments
                        </button>
                        <button className="cta-button secondary" onClick={() => navigate('/player')}>
                            View Profile
                        </button>
                    </div>
                </div>
            </section>

            <section className="features-grid">
                <div className="feature-card" onClick={() => navigate('/tournaments')}>
                    <div className="feature-icon">🏆</div>
                    <h3>Tournaments</h3>
                    <p>Discover upcoming events in your state and never miss a local again.</p>
                </div>
                <div className="feature-card" onClick={() => navigate('/player')}>
                    <div className="feature-icon">👤</div>
                    <h3>Player Insights</h3>
                    <p>Deep dive into your set history and track your progress over time.</p>
                </div>
                <div className="feature-card" onClick={() => navigate('/performance')}>
                    <div className="feature-icon">📊</div>
                    <h3>Performance</h3>
                    <p>Visualize your win rates and identify areas for improvement.</p>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Smasher. Powered by start.gg</p>
            </footer>
        </div>
    )
}