import React, { useEffect, useState } from 'react'
import { getUserRole } from '../../hooks/user'
import Statistics from './Statistics'
import CategoriesManagement from '../../components/CategoriesManagement'
import ServicesManagement from '../ServicesManagement'
import Bookings from '../Bookings'

export default function Dashboard() {
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    const [view, setView] = useState('statistics')
    return (
        <div>
            <div className='dashboardBox_container'>
                <div
                    onClick={() => { setView('statistics') }}
                    className={`dashboardBox sm:w-full lg:w-100 center gap-4 ${view == 'statistics' ? 'dashboardBoxActive' : ''}`}>
                    <i class="fa-solid fa-chart-simple"></i>
                    <strong>Statistics</strong>
                </div>
                <div
                    onClick={() => { setView('bookings') }}
                    className={`dashboardBox sm:w-full lg:w-100 center gap-4 ${view == 'orders' ? 'dashboardBoxActive' : ''}`}>
                    <i class=" fa-regular fa-clock"></i>
                    <strong>Bookings</strong>
                </div>
                <div
                    onClick={() => { setView('services') }}
                    className={`dashboardBox sm:w-full lg:w-100 center gap-4 ${view == 'products' ? 'dashboardBoxActive' : ''}`}>
                    <i class="fa-solid fa-clipboard-list"></i>
                    <strong>Services</strong>
                </div>
            </div>
            <div>
                {
                    view == 'bookings'
                        ? (<><Bookings /></>)
                        : view == 'services'
                            ? (<ServicesManagement statusType={'pending'} />)
                            : view == 'statistics'
                                ? (<Statistics />)
                                : view == 'categories'
                                    ? (<CategoriesManagement />)
                                    : (<></>)
                }
            </div>
        </div>
    )
}
