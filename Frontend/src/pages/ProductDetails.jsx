import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import PopUpLayout from '../components/PopUpLayout'
import Loader from '../components/Loader'
import Input from '../components/Input'
import { addToCart } from '../features/cart/cart'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Toast from '../components/Toast'
import { getUserRole } from '../hooks/user'
import AddProduct from './AddProduct'
export default function ProductDetails() {
    const [rejectReason, setRejectReason] = useState("");
    const token = localStorage.getItem('mvec_token')
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [editingMode, setEditingMode] = useState(false)
    const [openToast, setOpenToast] = useState(false)
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [images, setImages] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/api/products/${id}`)
                const data = response.data.data
                const response2 = await axios.get(`${import.meta.env.VITE_API_URL}/v1/api/categories/${data.categoryId}`)
                const category = response2.data.data.name
                const productData = { ...data, categoryName: category }
                setProduct(productData)
                if (productData) {
                    setLoading(false);
                }

                setImages([productData.heroImage, ...productData.images])
            } catch (error) {
                console.log(error)
            }
        }
        fetchProduct()
    }, [id])
    const handleAddToCart = () => {
        dispatch(addToCart({ productId: product._id, quantity: quantity, productName: product.title, productImage: product.heroImage, productPrice: product.price }))
        setOpenToast(true)
        setTimeout(() => {
            setOpenToast(false)
        }, 3000)
    }
    const aproveProduct = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/api/products/status/${id}`,
                { isApproved: "approved" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);

        } catch (error) {
            console.log(error)
            setMessage({
                text: error.message,
                type: 'error'
            })
            setOpenToast(true);
        } finally {
            setTimeout(() => { navigate('/admin-dashboard'), setOpenToast(false) }, 3000);
        }
    }
    const handleRejection = async () => {
        try {
            //update product to rejected
            //send message to seller
            const response = await axios.put(`http://localhost:5000/v1/api/products/status/${id}`,
                { isApproved: "rejected", rejectReason: rejectReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);

        } catch (error) {
            console.log(error)
            setMessage({
                text: error.message,
                type: 'error'
            })
            setOpenToast(true);
        } finally {
            //navigate to dashboard
            //close toaster
            setTimeout(() => { setOpenToast(false), navigate('/admin-dashboard') }, 3000);
        }
        //close PopUpLayout
        setIsOpen(false)
    }
    const handleRemoveProduct = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/v1/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);
            setTimeout(() => { navigate('/profile') }, 3000);
        } catch (error) {
            console.log(error)
            setMessage({
                text: error.response.data.message,
                type: 'error'
            })
            setOpenToast(true);
        } finally {
            setTimeout(() => { setOpenToast(false) }, 3000);
        }
        //close PopUpLayout
        setIsOpen(false)
    }
    return (
        <div className='flex flex-col items-center pb-20'>
            {
                loading ? (<Loader />)
                    : (
                        <>
                            <PopUpLayout open={imageUrl}>
                                <i
                                    onClick={() => { setImageUrl('') }}
                                    class="cursor-pointer text-3xl text-right w-full fa-regular fa-circle-xmark">
                                </i>
                                {
                                    imageUrl && <img className='rounded-md' src={imageUrl} />
                                }
                            </PopUpLayout>
                            {product.heroImage && (
                                <div className='productImages'>
                                    {images.map((i, index) => (
                                        <div key={index} className='img cursor-pointer' onClick={() => { setImageUrl(`http://localhost:5000/${i}`) }}>
                                            <img src={`http://localhost:5000/${i}`} alt={`product-${index}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <h2 className='title text-center'>{product.title}</h2>
                            <table>
                                <tr>
                                    <th>Description:</th>
                                    <td>{product.description}</td>
                                </tr>
                                <tr>
                                    <th>Price:</th>
                                    <td>{product.price}$</td>
                                </tr>
                                <tr>
                                    <th>Stock:</th>
                                    <td>{product.stock}</td>
                                </tr>
                                <tr>
                                    <th>Category:</th>
                                    <td>{product.categoryName}</td>
                                </tr>
                                {
                                    userRole && userRole == 'admin'
                                        ? <tr>
                                            <th>Status:</th>
                                            <td>{product.isApproved}</td>
                                        </tr>
                                        : <></>
                                }
                            </table>

                            {
                                userRole && userRole == 'customer'
                                    ? (<>
                                        <div className='flex gap-2' style={{ paddingBottom: '1rem' }}>
                                            <Button style={'btn-secondary'} onClick={handleAddToCart}>
                                                <div className="flex gap-2 items-center justify-center">
                                                    <i className="fa-solid fa-bag-shopping"></i>
                                                    <span>Add to card</span>
                                                </div>
                                            </Button>
                                            <div className='w-30'>
                                                <Input type={'number'} value={quantity} onChange={(e) => { setQuantity(+e.target.value) }} />
                                            </div>
                                        </div>
                                    </>)
                                    : userRole && userRole == 'admin'
                                        ? (<>
                                            <div className="flex gap-2 justify-center w-100">
                                                <Button
                                                    disabled={product.isApproved == 'approved'}
                                                    style="btn-primary"
                                                    onClick={aproveProduct}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => setIsOpen(true)}
                                                    style="btn-danger"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </>)
                                        : userRole && userRole == 'seller'
                                            ? (<>
                                                <div className="flex gap-2 justify-center w-100">
                                                    <Button
                                                        style="btn-primary"
                                                        onClick={() => { setEditingMode(true) }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => setIsOpen(true)}
                                                        style="btn-danger"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </>)
                                            : (<></>)
                            }
                        </>
                    )
            }
            {
                openToast ? (<Toast
                    message={message.text}
                    type={message.type}
                />) : (<></>)
            }
            <PopUpLayout open={isOpen}>
                <div className="flex flex-col justify-between gap-4">
                    <p className="text-xl text-center">
                        {userRole == 'admin' ? "Reasons for rejection" : userRole == 'seller' ? 'Are you sure you want to remove this product ?' : ''}
                    </p>
                    {
                        userRole && userRole == 'admin'
                            ? (<form action="">
                                <textarea name="Rejection Reasons" placeholder='Why..' onChange={(e) => { setRejectReason(e.target.value) }}></textarea>
                            </form>)
                            : (<></>)
                    }
                    <div className="flex gap-2 justify-center">
                        {
                            userRole && userRole == 'admin'
                                ? (<Button
                                    style="btn-danger"
                                    onClick={() => {
                                        handleRejection()
                                    }}
                                >
                                    Reject
                                </Button>)
                                : userRole && userRole == 'seller'
                                    ? (<Button
                                        style="btn-danger"
                                        onClick={() => {
                                            handleRemoveProduct()
                                        }}
                                    >
                                        Remove
                                    </Button>)
                                    : (<></>)
                        }
                        <Button
                            onClick={() => setIsOpen(false)}
                            style="btn-secondary"
                        >
                            cancle
                        </Button>
                    </div>
                </div>
            </PopUpLayout>
            {/* editing mode for seller only*/}
            <PopUpLayout open={editingMode}>
                <div className="flex flex-col justify-between gap-2">
                    <i
                        onClick={() => { setEditingMode(false) }}
                        class="cursor-pointer text-3xl text-right w-full fa-regular fa-circle-xmark">
                    </i>
                    <AddProduct isEditing={true} productId={id} setEditingMode={setEditingMode}/>
                </div>
            </PopUpLayout>
        </div>
    )
}
