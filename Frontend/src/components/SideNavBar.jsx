import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleNavBar } from '../features/puplic/navBar.js';
import LogoutButton from './LogoutButton.jsx';
import { getUserRole } from '../hooks/user.js';
export default function SideNavBar() {
    const token = localStorage.getItem('mvec_token')
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        if (token) {
            const fetchRole = async () => {
                const role = await getUserRole();
                setUserRole(role)
            }
            fetchRole()
        }
    }, [])
    const storedUser = localStorage.getItem("mvec-user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.navBar.isOpen);
    const location = useLocation();
    let links = [
        { name: 'Home', path: '/', icon: 'fa-home' },
        { name: 'Services', path: '/services', icon: 'fa-bag-shopping' },
        { name: 'About', path: '/about', icon: 'fa-info-circle' },
        { name: 'Contact', path: '/contact', icon: 'fa-phone' },
    ];
    if (userRole) {
        links.push(
            ...[
                { name: 'Orders', path: '/orders', icon: 'fa-hand' },
            ]
        );
    }
    if (userRole === 'admin') {
        links.push(
            ...[
                { name: 'Admin Dashboard', path: '/admin-dashboard', icon: 'fa-grip' },

            ]
        );
    } else if (userRole === 'seller') {
        links.push(
            ...[
                { name: 'Add Product', path: '/add-product', icon: 'fa-plus' },
            ]
        );
    } else if (userRole === 'customer') {
        links.push(
            ...[
                { name: 'Cart', path: '/cart', icon: 'fa-cart-arrow-down' },
            ]
        );
    }
    if (userRole) {
        links.push(
            ...[
                { name: 'Profile', path: '/profile', icon: 'fa-solid fa-user' },
            ]
        );
    }

    const isActiveLink = (path) => location.pathname === path;
    return (
        <div className={`side_navbar_container ${isOpen ? 'navBar_opened' : 'navBar_closed'}`}>
            <span
                className={`btn_sideNavBar center ${isOpen ? '-right-4' : '-right-9'}`}
                onClick={() => { dispatch(toggleNavBar()) }}
            >
                <i className={`fa-solid fa-circle-arrow-${isOpen ? 'left' : 'right'}`}></i>
            </span>
            <nav className='side_navbar'>
                <ul className='side_navbar_links'>
                    {links.map((link, index) => (
                        <Link to={link.path} key={index}>
                            <li className={`link ${isActiveLink(link.path) ? 'active_link' : ''}`}
                                onClick={() => { if (window.innerWidth < 1024) { dispatch(toggleNavBar()); } }}>
                                <i className={` fa-solid ${link.icon} mr-2`}></i>
                                {link.name}
                            </li>
                        </Link>
                    ))}
                    {
                        user
                            ? (<>
                                <LogoutButton />
                            </>)
                            : (<>
                                <Link to={'/login-signup'} onClick={() => { dispatch(toggleNavBar()) }} >
                                    <li className={`link ${isActiveLink('/login-signup') ? 'active_link' : ''}`}>
                                        <i className={` fa-solid fa-user mr-2`}></i>
                                        Login
                                    </li>
                                </Link>
                            </>)
                    }
                </ul>
            </nav>
            {
                user
                    ? (
                        <Link to={'/profile'} onClick={() => { if (window.innerWidth < 1024) { dispatch(toggleNavBar()); } }}>
                            <div className='accountLink'>
                                <i className={`center flex bg-white text-[var(--color-secondary)]  w-8 h-8 rounded-full  fa-solid fa-user mr-2`}></i>
                                {user}
                            </div>
                        </Link>
                    )
                    : (<></>)
            }

        </div>
    )
}
