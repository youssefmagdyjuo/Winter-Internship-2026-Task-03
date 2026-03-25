import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <Link className="logo" to="/">Kliordx</Link>
                    <p className="tagline">
                        Connect with trusted professionals and book services easily.
                    </p>
                </div>

                <nav className="footer-nav" aria-label="Footer navigation">
                    <div className="nav-column">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </nav>

                <div className="footer-subscribe">
                    <h4>Follow us</h4>
                    <div className="social" aria-hidden="false">
                        <a href="#" className="social-link" aria-label="Twitter">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.28-1.11 1.54-1.92-.68.4-1.44.68-2.25.84A3.6 3.6 0 0016.15 4c-2 0-3.6 1.64-3.6 3.66 0 .29.03.57.09.84-3-.15-5.66-1.59-7.45-3.78-.31.54-.49 1.16-.49 1.83 0 1.27.64 2.39 1.62 3.05-.59-.02-1.15-.18-1.64-.45v.04c0 1.77 1.24 3.24 2.88 3.58-.3.08-.62.12-.95.12-.23 0-.46-.02-.68-.06.46 1.42 1.8 2.45 3.39 2.48A7.3 7.3 0 012 19.54a10.3 10.3 0 005.58 1.64c6.69 0 10.35-5.9 10.35-11.02 0-.17 0-.34-.01-.51.71-.5 1.32-1.13 1.8-1.84-.65.3-1.35.51-2.08.6z" /></svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.4A4.6 4.6 0 1016.6 13 4.6 4.6 0 0012 8.4zm6.5-2.6a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1zM12 10.8A1.2 1.2 0 1110.8 9.6 1.2 1.2 0 0112 10.8z" /></svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.88v-7h-2.2V12h2.2V9.6c0-2.18 1.3-3.4 3.28-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.08 0-1.42.67-1.42 1.36V12h2.42l-.39 2.88h-2.03v7A10 10 0 0022 12z" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <small>© {new Date().getFullYear()} Kliordx. All rights reserved.</small>
                </div>
            </div>
        </footer>
    )
}