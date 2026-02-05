import React, { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import ProductCard from '../components/ProductCard'
import { useSelector, useDispatch } from 'react-redux'
import { getallOrders } from '../features/orders/allOrders'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import axios from 'axios'

export default function Orders() {

    const [loading, setLoading] = useState(true)
    const isOpen = useSelector((state) => state.navBar.isOpen)
    const token = localStorage.getItem('mvec_token')
    const allOrders = useSelector((state) => state.allOrders);

    const [searchData, setSearchData] = useState({
        orderId: '',
        status: ''
    })
    const dispatch = useDispatch()
    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/v1/api/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                dispatch(getallOrders(response.data.data))
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])
    const filteredOrders = useMemo(() => {
        return allOrders.filter(order => {

            const orderIdMatch =
                order._id
                    .toLowerCase()
                    .includes(searchData.orderId.toLowerCase())

            const statusMatch =
                searchData.status === '' ||
                order.status?.toLowerCase()
                    .includes(searchData.status.toLowerCase())

            return orderIdMatch && statusMatch
        })
    }, [allOrders, searchData])

    return (
        <div>

            {/* Search Section */}
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className='text-lg w-full center font-bold'>
                        Search Orders
                    </span>

                    <Input
                        placeholder="Order ID"
                        value={searchData.orderId}
                        onChange={(e) =>
                            setSearchData(prev => ({
                                ...prev,
                                orderId: e.target.value
                            }))
                        }
                    />

                    <Input
                        placeholder="Status (pending, completed...)"
                        value={searchData.status}
                        onChange={(e) =>
                            setSearchData(prev => ({
                                ...prev,
                                status: e.target.value
                            }))
                        }
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="w-full overflow-x-auto">
                {
                    loading ? (
                        <Loader />
                    ) : filteredOrders.length > 0 ? (
                        <table className=" w-full border-collapse text-center ordersTable">

                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">

                                        <td className="p-3 border">
                                            #{order._id.slice(-6)}
                                        </td>

                                        <td className="p-3 border">
                                            <span className={` rounded text-white 
                                            ${order.status === "completed"
                                                    ? "bg-[var(--green)]"
                                                    :order.status === "cancelled"
                                                    ? "bg-[var(--gray)]"
                                                    :order.status === "pending"
                                                    ?"bg-[var(--yellow)]"
                                                    :"bg-[var(--color-primary)]"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td >
                                            {order.items.length}
                                        </td>

                                        <td className="p-3 border font-bold">
                                            {order.totalAmount}$
                                        </td>

                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>

                                        <td >
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="text-[var(--color-primary)] underline"
                                            >
                                                View
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                        </tbody>

                        </table>
            ) : (
            <p className="no-results center">
                No orders found
            </p>
            )
                }
        </div>


        </div >
    )
}
