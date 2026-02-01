import React, { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import ProductCard from '../components/ProductCard'
import { getApprovedProducts } from '../features/products/approvedProducts'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApprovedProductsData } from '../hooks/productsFetching'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
export default function Products() {
    //variables
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const isOpen = useSelector((state) => state.navBar.isOpen);
    const approvedProducts = useSelector((state) => state.approvedProducts);
    const [searchData, setSearchData] = useState({
        productName: '',
        categoryName: '',
        vendorName: ''
    })
    //fetching data
    useEffect(() => {
        const renderFun = async () => {
            const data = await fetchApprovedProductsData()
            if (data) {
                dispatch(getApprovedProducts(data));

            }

            setLoading(false);

        }
        renderFun()
    }, [])

    //search logic by useMemo
    const filteredProducts = useMemo(() => {
        return approvedProducts.filter(product => {
            const productNameMatch =
                product.title.toLowerCase()
                    .includes(searchData.productName.toLowerCase());

            const categoryMatch =
                searchData.categoryName === '' ||
                product.categoryName?.toLowerCase()
                    .includes(searchData.categoryName.toLowerCase());

            const vendorMatch =
                searchData.vendorName === '' ||
                product.sellerName?.toLowerCase()
                    .includes(searchData.vendorName.toLowerCase());

            return productNameMatch && categoryMatch && vendorMatch;
        });
    }, [approvedProducts, searchData]);

    return (
        <div>
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className='text-lg w-full center font-bold'>Search by: </span>
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
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <Link to={`/products/${product._id}`} key={index}>
                                <ProductCard>
                                    <div className='productImg'>
                                        <img src={`http://localhost:5000/${product.heroImage}`} />
                                    </div>

                                    <div className="productContent">
                                        <h3 className="productTitle">{product.title}</h3>
                                        <p className="productDesc">{product.description}</p>
                                        <h3 className="productPrice">{product.price}$</h3>
                                    </div>

                                    <p className="productProvider">
                                        provided by : {product.sellerName}
                                    </p>
                                </ProductCard>
                            </Link>
                        ))
                    ) : (
                        <p className="no-results">No products found</p>
                    )
                }
            </div>
        </div>
    )
}
