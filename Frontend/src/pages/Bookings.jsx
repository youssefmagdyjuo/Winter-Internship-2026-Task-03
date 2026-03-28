// import React, { useEffect, useMemo, useState } from 'react'
// import Input from '../components/Input'
// import ProductCard from '../components/ProductCard'
// import { useSelector, useDispatch } from 'react-redux'
// import { getallOrders } from '../features/orders/allOrders'
// import { Link } from 'react-router-dom'
// import Loader from '../components/Loader'
// import axios from 'axios'

// export default function Orders() {

//     const [loading, setLoading] = useState(true)
//     const isOpen = useSelector((state) => state.navBar.isOpen)
//     const token = localStorage.getItem('mvec_token')
//     const allOrders = useSelector((state) => state.allOrders);

//     const [searchData, setSearchData] = useState({
//         orderId: '',
//         status: ''
//     })
//     const dispatch = useDispatch()
//     // Fetch Orders
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_API_URL}/v1/api/orders`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 )
//                 dispatch(getallOrders(response.data.data))
//                 console.log(response.data.data);

//             } catch (error) {
//                 console.log(error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchOrders()
//     }, [])
//     const filteredOrders = useMemo(() => {
//         return allOrders.filter(order => {

//             const orderIdMatch =
//                 order._id
//                     .toLowerCase()
//                     .includes(searchData.orderId.toLowerCase())

//             const statusMatch =
//                 searchData.status === '' ||
//                 order.status?.toLowerCase()
//                     .includes(searchData.status.toLowerCase())

//             return orderIdMatch && statusMatch
//         })
//     }, [allOrders, searchData])

//     return (
//         <div>

//             {/* Orders List */}
//             <div className="w-full overflow-x-auto p-4">
//                 {
//                     loading ? (
//                         <Loader />
//                     ) : filteredOrders.length > 0 ? (
//                         <table className=" w-full border-collapse text-center ordersTable">

//                             <thead>
//                                 <tr>
//                                     <th>Order ID</th>
//                                     <th>Status</th>
//                                     <th>Items</th>
//                                     <th>Total</th>
//                                     <th>Date</th>
//                                     <th>Details</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {filteredOrders.map((order) => (
//                                     <tr key={order._id} className="hover:bg-gray-50">

//                                         <td className="p-3 border">
//                                             #{order._id.slice(-6)}
//                                         </td>

//                                         <td className="p-3 border">
//                                             <span className={` rounded text-white 
//                                             ${order.status === "completed"
//                                                     ? "bg-[var(--green)]"
//                                                     : order.status === "cancelled"
//                                                         ? "bg-[var(--gray)]"
//                                                         : order.status === "pending"
//                                                             ? "bg-[var(--yellow)]"
//                                                             : "bg-[var(--color-primary)]"
//                                                 }`}>
//                                                 {order.status}
//                                             </span>
//                                         </td>

//                                         <td >
//                                             {order.items.length}
//                                         </td>

//                                         <td className="p-3 border font-bold">
//                                             {order.totalAmount}$
//                                         </td>

//                                         <td>
//                                             {new Date(order.createdAt).toLocaleDateString()}
//                                         </td>

//                                         <td >
//                                             <Link
//                                                 to={`/orders/${order._id}`}
//                                                 className="text-[var(--color-primary)] underline"
//                                             >
//                                                 View
//                                             </Link>
//                                         </td>

//                                     </tr>
//                                 ))}
//                             </tbody>

//                         </table>
//                     ) : (
//                         <p className="no-results center">
//                             No orders found
//                         </p>
//                     )
//                 }
//             </div>


//         </div >
//     )
// }




import React, { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import { useSelector, useDispatch } from 'react-redux'
import { getAllBookings } from '../features/bookings/allBookings'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import axios from 'axios'

export default function Bookings() {

    const [loading, setLoading] = useState(true)
    const isOpen = useSelector((state) => state.navBar.isOpen)
    const token = localStorage.getItem('ssbms_token')
    const allBookings = useSelector((state) => state.allBookings)

    const [searchData, setSearchData] = useState({
        bookingId: '',
        status: ''
    })

    const dispatch = useDispatch()

    // Fetch Bookings
    useEffect(() => {
        const fetchBookings = async () => {

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/v1/api/bookings`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                dispatch(getAllBookings(response.data.data))
                console.log(response.data.data);
                

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [])

    // Filter
    const filteredBookings = useMemo(() => {
        return allBookings.filter(booking => {

            const idMatch =
                booking._id
                    .toLowerCase()
                    .includes(searchData.bookingId.toLowerCase())

            const statusMatch =
                searchData.status === '' ||
                booking.status?.toLowerCase()
                    .includes(searchData.status.toLowerCase())

            return idMatch && statusMatch
        })
    }, [allBookings, searchData])

    return (
        <div>
            {/* Search Section */}
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className='text-lg w-full center font-bold'>
                        Search Booking
                    </span>

                    <Input
                        placeholder="Booking ID"
                        value={searchData.bookingId}
                        onChange={(e) =>
                            setSearchData(prev => ({
                                ...prev,
                                bookingId: e.target.value
                            }))
                        }
                    />

                    <Input
                        placeholder="Status (pending, approved...)"
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


            {/* Table */}
            <div className="w-full overflow-x-auto p-4">
                {
                    loading ? (
                        <Loader />
                    ) : filteredBookings.length > 0 ? (
                        <table className="w-full text-center border-collapse">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3">Booking ID</th>
                                    <th className="p-3">Service</th>
                                    <th className="p-3">Provider</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">

                                        <td className="p-3 border">
                                            #{booking._id.slice(-6)}
                                        </td>

                                        <td className="p-3 border">
                                            {booking.serviceName || "Service"}
                                        </td>

                                        <td className="p-3 border">
                                            {booking.providerName || "Provider"}
                                        </td>

                                        <td className="p-3 border">
                                            {new Date(booking.date).toLocaleDateString()}
                                        </td>

                                        <td className="p-3 border">
                                            <span className={`px-3 py-1 rounded text-white text-sm
                                                ${booking.status === "approved"
                                                    ? "bg-green-500"
                                                    : booking.status === "rejected"
                                                        ? "bg-red-500"
                                                        : "bg-yellow-500"
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td className="p-3 border">
                                            <Link
                                                to={`/bookings/${booking._id}`}
                                                className="text-blue-600 underline"
                                            >
                                                View
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    ) : (
                        <p className="text-center text-gray-500">
                            No bookings found
                        </p>
                    )
                }
            </div>

        </div>
    )
}