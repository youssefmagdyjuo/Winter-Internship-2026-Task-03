import React, { useEffect, useState } from 'react'
import { getUserRole } from '../../hooks/user'
import Orders from '../Orders'
import Statistics from './Statistics'
import ProductsManagement from '../ProductsManagement'

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
                    onClick={() => { setView('orders') }}
                    className={`dashboardBox sm:w-full lg:w-100 center gap-4 ${view == 'orders' ? 'dashboardBoxActive' : ''}`}>
                    <i class=" fa-regular fa-clock"></i>
                    <strong>Orders</strong>
                </div>
                <div
                    onClick={() => { setView('products') }}
                    className={`dashboardBox sm:w-full lg:w-100 center gap-4 ${view == 'products' ? 'dashboardBoxActive' : ''}`}>
                    <i class="fa-solid fa-clipboard-list"></i>
                    <strong>Products</strong>
                </div>
            </div>
            <div>
                {
                    view == 'orders'
                        ? (<><Orders /></>)
                        : view == 'products'
                            ? (<ProductsManagement statusType={'pending'}/>)
                            : view == 'statistics'
                                ? (<Statistics />)
                                : (<></>)
                }
            </div>
        </div>
    )
}
