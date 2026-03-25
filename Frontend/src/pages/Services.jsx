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
        productName: '',
        categoryName: '',
        vendorName: ''
    })
    //fetching data
    useEffect(() => {
        const renderFun = async () => {
            const data = await fetchAllServices()
            console.log(data)
            if (data) {
                dispatch(getServices(data));

            }

            setLoading(false);

        }
        renderFun()
    }, [])

    //search logic by useMemo
    const filteredServices = useMemo(() => {
        return services.filter(product => {
            const productNameMatch =
                product.title.toLowerCase()
                    .includes(searchData.productName.toLowerCase());

            const vendorMatch =
                searchData.vendorName === '' ||
                product.sellerName?.toLowerCase()
                    .includes(searchData.vendorName.toLowerCase());

            return productNameMatch && vendorMatch;
        });
    }, [services, searchData]);

    return (
        <div>
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className=' w-full center font-bold'>Search by: </span>
                    <Input
                        placeholder={"Product Name"}
                        value={searchData.productName}
                        onChange={(e) => {
                            setSearchData(prev => ({
                                ...prev,
                                productName: e.target.value
                            }))
                        }}
                    />
                    <Input
                        placeholder={"Ctegory Name"}
                        value={searchData.categoryName}
                        onChange={(e) => {
                            setSearchData(prev => ({
                                ...prev,
                                categoryName: e.target.value
                            }))
                        }}
                    />
                    <Input
                        placeholder={"Vendor Name"}
                        value={searchData.vendorName}
                        onChange={(e) => {
                            setSearchData(prev => ({
                                ...prev,
                                vendorName: e.target.value
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
                            <Link to={`/products/${product._id}`} key={index}>
                                <ProductCard>
                                    <div className='productImg'>
                                        <img src={`${import.meta.env.VITE_API_URL}/${product.heroImage}`} />
                                    </div>

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
