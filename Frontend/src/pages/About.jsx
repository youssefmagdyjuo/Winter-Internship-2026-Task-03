import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

const team = [
    { name: 'Youssef Magdy', role: 'Product Manager' },
    { name: 'Ahmed Shrif', role: 'Lead Developer' },
    { name: 'Sara Gamal', role: 'Design Lead' },
]

export default function About() {
    return (
        <main className="about-page">

            {/* HERO */}
            <section className="about-hero">
                <div className="container hero-inner">
                    <h1 className="hero-title">About Kliordx</h1>
                    <p className="hero-sub">
                        We connect customers with trusted service providers,
                        making it easy to discover, compare, and book services in one place.
                    </p>

                    <div className="hero-actions">
                        <Link to={'/services'}>
                            <Button style={'btn-primary'}>
                                Browse Services
                            </Button>
                        </Link>
                        <Link to={'/contact'}>
                            <Button style={'btn-secondary'}>
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* MISSION */}
            <section className="about-mission container">
                <h2>Our Mission</h2>
                <p className="lead">
                    To simplify the process of finding and booking reliable services
                    while helping professionals grow their businesses.
                </p>

                <ul className="features">
                    <li>Verified and trusted service providers</li>
                    <li>Easy and fast booking experience</li>
                    <li>Transparent pricing and service details</li>
                    <li>Reliable support and user-friendly platform</li>
                </ul>
            </section>


            {/* STATS */}
            <section className="about-stats">
                <div className="container stats-grid">
                    <div className="stat">
                        <div className="stat-number">5k+</div>
                        <div className="stat-label">Services</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">2k+</div>
                        <div className="stat-label">Providers</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">99%</div>
                        <div className="stat-label">Satisfaction</div>
                    </div>
                </div>
            </section>


            {/* TEAM */}
            <section className="about-team container">
                <h2>Meet the Team</h2>
                <div className="team-grid">
                    {team.map((person) => (
                        <div className="team-card" key={person.name}>
                            <div className="avatar" aria-hidden></div>
                            <h3>{person.name}</h3>
                            <p className="role">{person.role}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* CTA */}
            <section className="about-cta container">
                <h2>Are you a service provider?</h2>
                <p>
                    Join Kliordx and start offering your services to thousands of customers.
                </p>

                <Link className="btn btn-primary" to="/register">
                    Get Started
                </Link>
            </section>

        </main>
    )
}