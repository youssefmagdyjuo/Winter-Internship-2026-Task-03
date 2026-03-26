import React, { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import ProductCard from '../components/ProductCard'
import { getServices } from '../features/services folder/services'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllServices } from '../hooks/fetching'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
export default function Services() {
    //variables
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const isOpen = useSelector((state) => state.navBar.isOpen);
    const services = useSelector((state) => state.services);
    const [searchData, setSearchData] = useState({
        serviceName: '',
        providerName: ''
    })
    //fetching data
    useEffect(() => {
        const renderFun = async () => {
            const data = await fetchAllServices()
            // console.log(data)
            if (data) {
                dispatch(getServices(data));

            }

            setLoading(false);

        }
        renderFun()
    }, [])

    //search logic by useMemo
    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const serviceNameMatch =
                service.title.toLowerCase()
                    .includes(searchData.serviceName.toLowerCase());

            const providerMatch =
                searchData.providerName === '' ||
                service.providerName?.toLowerCase()
                    .includes(searchData.providerName.toLowerCase());

            return serviceNameMatch && providerMatch;
        });
    }, [services, searchData]);

    return (
        <div>
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className=' w-full center font-bold'>Search by: </span>
                    <Input
                        placeholder={"Service Name"}
                        value={searchData.serviceName}
                        onChange={(e) => {
                            setSearchData(prev => ({
                                ...prev,
                                serviceName: e.target.value
                            }))
                        }}
                    />
                    <Input
                        placeholder={"Provider Name"}
                        value={searchData.providerName}
                        onChange={(e) => {
                            setSearchData(prev => ({
                                ...prev,
                                providerName: e.target.value
                            }))
                        }}
                    />
                </div>
            </div>
            <div className="Products_container">
                {
                    loading ? (
                        <Loader />
                    ) : filteredServices.length > 0 ? (
                        filteredServices.map((product, index) => (
                            <Link to={`/services/${product._id}`} key={index}>
                                <ProductCard>
                                    <div className="productContent">
                                        <h3 className="productTitle">{product.title}</h3>
                                        <p className="productDesc">{product.description}</p>
                                        <h3 className="productPrice">{product.price}$</h3>
                                    </div>

                                    <p className="productProvider">
                                        provided by : {product.providerName}
                                    </p>
                                </ProductCard>
                            </Link>
                        ))
                    ) : (
                        <p className="no-results center">No products found</p>
                    )
                }
            </div>
        </div>
    )
}
