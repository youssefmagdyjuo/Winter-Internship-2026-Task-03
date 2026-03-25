import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { toggleNavBar } from '../features/puplic/navBar.js';
import LogoutButton from './LogoutButton.jsx';
export default function UpperNavBar() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.navBar.isOpen);
    const storedUser = localStorage.getItem("mvec-user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    return (
        <div className='upper_navbar_container'>
            <nav className='upper_navbar'>
                <Link to="/">
                    <img src="/kliordx_logo.png" alt="Logo" className="logo" />
                </Link>
                <div className="w-25 hidden lg:block">
                    {
                        user
                            ? (<>
                                <LogoutButton />
                            </>)
                            : (<>
                                <Link to="/login-signup">
                                    <Button style={'btn-primary'}>Login</Button>
                                </Link>
                            </>)
                    }
                </div>
                <div className="nav_btn" onClick={() => dispatch(toggleNavBar())}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </nav>
        </div>
    )
}
