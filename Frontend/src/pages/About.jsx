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
            <section className="about-hero">
                <div className="container hero-inner">
                    <h1 className="hero-title">About Our Marketplace</h1>
                    <p className="hero-sub">We connect creators and customers by building a secure, simple, and delightful shopping experience.</p>
                    <div className="hero-actions">
                        <Link to={'/products'}>
                                <Button style={'btn-primary'}>
                                    Browse Products
                                </Button>
                        </Link>
                        <Link to={'/contact'}>
                            <div className='w-40'>
                                <Button style={'btn-secondary'}>
                                    Contact Us
                                </Button>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="about-mission container">
                <h2>Our Mission</h2>
                <p className="lead">To empower small creators and provide customers an enjoyable, trustworthy place to discover unique products.</p>
                <ul className="features">
                    <li>Curated products and verified sellers</li>
                    <li>Secure checkout and fast shipping</li>
                    <li>Responsive support and clear policies</li>
                    <li>Community-driven marketplace with user feedback</li>
                    
                </ul>
            </section>

            <section className="about-stats">
                <div className="container stats-grid">
                    <div className="stat">
                        <div className="stat-number">5k+</div>
                        <div className="stat-label">Products</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">2k+</div>
                        <div className="stat-label">Sellers</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">99%</div>
                        <div className="stat-label">Satisfaction</div>
                    </div>
                </div>
            </section>

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

            <section className="about-cta container">
                <h2>Want to join or sell with us?</h2>
                <p>Sign up today and reach thousands of customers — it's free to get started.</p>
                <a className="btn btn-primary" href="/add-product">Get Started</a>
            </section>
        </main>
    )
}
