
import React, { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import { useSelector } from 'react-redux'
import { fetchAllServices } from '../hooks/fetching'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import { getUserRole } from '../hooks/user'

export default function ServicesManagement({ statusType }) {
    const [loading, setLoading] = useState(true)
    const isOpen = useSelector((state) => state.navBar.isOpen)
    const [allServices, setAllServices] = useState([])
    const [searchData, setSearchData] = useState({
        serviceName: '',
        providerName: '',
    })
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    // Fetch Products
    useEffect(() => {
        const renderFun = async () => {
            const data = await fetchAllServices()
            if (data) {
                setAllServices(data)
            }
            setLoading(false)
        }
        renderFun()
    }, [])

    // Filter Logic
    const filteredServices = useMemo(() => {
        return allServices.filter(service => {

            const serviceNameMatch =
                service.title.toLowerCase()
                    .includes(searchData.serviceName.toLowerCase())

            const providerMatch =
                searchData.providerName === '' ||
                service.providerName?.toLowerCase()
                    .includes(searchData.providerName.toLowerCase())

            return serviceNameMatch && providerMatch 
        })
    }, [allServices, searchData])

    return (
        <div>

            {/* Search Section */}
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className='text-lg w-full center font-bold'>
                        Search Services
                    </span>

                    <Input
                        placeholder="Service Name"
                        value={searchData.serviceName}
                        onChange={(e) =>
                            setSearchData(prev => ({
                                ...prev,
                                serviceName: e.target.value
                            }))
                        }
                    />

                    {
                        userRole == 'admin' ? <Input
                            placeholder="provider Name"
                            value={searchData.providerName}
                            onChange={(e) =>
                                setSearchData(prev => ({
                                    ...prev,
                                    providerName: e.target.value
                                }))
                            }
                        /> : ''
                    }
                </div>
            </div>

            {/* Products Table */}
            <div className="w-full overflow-x-auto p-4">
                {
                    loading ? (
                        <Loader />
                    ) : filteredServices.length > 0 ? (
                        <table className="w-full border-collapse text-center productsTable">

                            <thead>
                                <tr>
                                    <th>Service</th>
                                    {userRole == 'admin' ? <th>Provider</th> : ''}
                                    <th>Price</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredServices.map((service) => (
                                    <tr key={service._id} className="hover:bg-gray-50">
                                        <td>
                                            {service.title}
                                        </td>

                                        {
                                            userRole == 'admin' ?
                                                <td >
                                                    {service.sellerName}
                                                </td> : ''
                                        }
                                        <td className="font-bold">
                                            {service.price}$
                                        </td>



                                        <td>
                                            <Link
                                                to={`/services/${service._id}`}
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
                            No services found
                        </p>
                    )
                }
            </div>

        </div>
    )
}

