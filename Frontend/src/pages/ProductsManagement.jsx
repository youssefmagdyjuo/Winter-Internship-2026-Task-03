
import React, { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import { useSelector } from 'react-redux'
import { fetchAllProducts } from '../hooks/productsFetching'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import { getUserRole } from '../hooks/user'

export default function ProductsManagement({ statusType }) {
    const [loading, setLoading] = useState(true)
    const isOpen = useSelector((state) => state.navBar.isOpen)
    const [allProducts, setAllProducts] = useState([])
    const [searchData, setSearchData] = useState({
        productName: '',
        categoryName: '',
        vendorName: '',
        status: statusType
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
            const data = await fetchAllProducts()
            if (data) {
                setAllProducts(data)
            }
            setLoading(false)
        }
        renderFun()
    }, [])

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {

            const productNameMatch =
                product.title.toLowerCase()
                    .includes(searchData.productName.toLowerCase())

            const categoryMatch =
                searchData.categoryName === '' ||
                product.categoryName?.toLowerCase()
                    .includes(searchData.categoryName.toLowerCase())

            const vendorMatch =
                searchData.vendorName === '' ||
                product.sellerName?.toLowerCase()
                    .includes(searchData.vendorName.toLowerCase())
            const statusMatch =
                searchData.status === '' ||
                product.isApproved?.toLowerCase()
                    .includes(searchData.status.toLowerCase())

            return productNameMatch && categoryMatch && vendorMatch && statusMatch
        })
    }, [allProducts, searchData])

    return (
        <div>

            {/* Search Section */}
            <div className={`search_section_container center ${isOpen ? '' : 'full_layout'}`}>
                <div className="search_section">
                    <span className='text-lg w-full center font-bold'>
                        Search Products
                    </span>

                    <Input
                        placeholder="Product Name"
                        value={searchData.productName}
                        onChange={(e) =>
                            setSearchData(prev => ({
                                ...prev,
                                productName: e.target.value
                            }))
                        }
                    />

                    <Input
                        placeholder="Category Name"
                        value={searchData.categoryName}
                        onChange={(e) =>
                            setSearchData(prev => ({
                                ...prev,
                                categoryName: e.target.value
                            }))
                        }
                    />
                    {
                        userRole == 'admin' ? <Input
                            placeholder="Vendor Name"
                            value={searchData.vendorName}
                            onChange={(e) =>
                                setSearchData(prev => ({
                                    ...prev,
                                    vendorName: e.target.value
                                }))
                            }
                        /> : ''
                    }

                    <Input
                        placeholder="Status"
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

            {/* Products Table */}
            <div className="w-full overflow-x-auto p-4">
                {
                    loading ? (
                        <Loader />
                    ) : filteredProducts.length > 0 ? (
                        <table className="w-full border-collapse text-center productsTable">

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Status</th>
                                    <th>Category</th>
                                    {userRole == 'admin' ? <th>Vendor</th> : ''}
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">

                                        <td>
                                            {product.title}
                                        </td>

                                        <td className="p-3 border">
                                            <span className={` rounded text-white 
                                            ${product.isApproved === "approved"
                                                    ? "bg-[var(--green)]"
                                                    : product.isApproved === "rejected"
                                                        ? "bg-[var(--color-danger)]"
                                                        : product.isApproved === "pending"
                                                            ? "bg-[var(--yellow)]"
                                                            : ""
                                                }`}>
                                                {product.isApproved}
                                            </span>
                                        </td>

                                        <td >
                                            {product.categoryName}
                                        </td>
                                        {
                                            userRole == 'admin' ?
                                                <td >
                                                    {product.sellerName}
                                                </td> : ''
                                        }
                                        <td className="font-bold">
                                            {product.price}$
                                        </td>

                                        <td >
                                            {product.stock}
                                        </td>

                                        <td>
                                            <Link
                                                to={`/products/${product._id}`}
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
                            No products found
                        </p>
                    )
                }
            </div>

        </div>
    )
}

