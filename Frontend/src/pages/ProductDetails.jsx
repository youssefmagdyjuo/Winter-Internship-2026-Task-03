import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import PopUpLayout from '../components/PopUpLayout'
import Loader from '../components/Loader'
import Input from '../components/Input'
import { addToCart } from '../features/cart/cart'
import { useSelector, useDispatch } from 'react-redux'
import Toast from '../components/Toast'
import { getUserRole } from '../hooks/user'
export default function ProductDetails() {
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
                const response = await axios.get(`http://localhost:5000/v1/api/products/${id}`)
                const data = response.data.data
                const response2 = await axios.get(`http://localhost:5000/v1/api/categories/${data.categoryId}`)
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
            const response = await axios.put(`http://localhost:5000/v1/api/products/status/${id}`,
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
            setTimeout(() => setOpenToast(false), 3000);
        }
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
                                                    style="btn-primary"
                                                    onClick={aproveProduct}
                                                >
                                                    Aprove
                                                </Button>
                                                <Button

                                                    style="btn-danger"
                                                >
                                                    reject
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
        </div>
    )
}
