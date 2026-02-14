import React from 'react';
import './styles/Home.css';

export const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to Smasher</h1>
            </header>
            <div className="home-content">
                <p>Analyze your Smash sets and track tournaments in your state.</p>
                <p>Use the sidebar to navigate between tournament listings and performance analysis.</p>
            </div>
        </div>
    )
}