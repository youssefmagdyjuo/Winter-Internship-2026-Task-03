import React from 'react'
import { Outlet } from 'react-router-dom'
import UpperNavBar from '../components/UpperNavBar'
import SideNavBar from '../components/SideNavBar'
import { useDispatch, useSelector } from 'react-redux'
import Footer from '../components/Footer'
export default function Layout() {
    // const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.navBar.isOpen);
    return (
        <div className='relative'>
            <UpperNavBar />
            <div className={`layout ${isOpen ? '' : 'full_layout'}`}>
                <SideNavBar />
                <Outlet />
            </div>
            <Footer/>
        </div>
    )
}
