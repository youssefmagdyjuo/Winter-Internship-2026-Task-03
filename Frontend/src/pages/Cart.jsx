
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {clearCart, removeFromCart, updateQuantityIncrease, updateQuantityDecrease } from '../features/cart/cart'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import Toast from '../components/Toast'
import PopUpLayout from '../components/PopUpLayout'
import axios from 'axios'

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openToast, setOpenToast] = useState(false)
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })
    const { items } = useSelector((state) => state.cart)

    //get token from localStorage
    const token = localStorage.getItem('mvec_token');
    const dispatch = useDispatch()

    if (items.length === 0) {
        return <h2 className='minHeight center'>Your cart is empty:)</h2>
    }
    const handlePlaceOrder = async () => {
        try {
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.BACKEND_BASEURL}/v1/api/orders`,
                {items},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            
            setMessage({ text: response.data.message, type: 'success' })
            setIsOpen(false)
            setOpenToast(true)

        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Something went wrong",
                type: 'error'
            })
            setOpenToast(true)
            console.log(error);

        } finally {
            setLoading(false)
            setTimeout(() => {setOpenToast(false),dispatch(clearCart())}, 3000)
            setIsOpen(false)
            
        }
    }

    return (
        <div>
            <div className="Products_container">
                {
                    items.map((item, index) => (
                        <div className='flex flex-col gap-4' key={index}>
                            <Link to={`/products/${item.productId}`} >
                                <ProductCard>
                                    <div className='productImg'>
                                        <img src={`http://localhost:5000/${item.productImage}`} />
                                    </div>

                                    <div className="productContent">
                                        <h3 className="productTitle">{item.productName}</h3>
                                        <h3 className="productPrice">{item.productPrice}$</h3>
                                    </div>
                                </ProductCard>
                            </Link>
                            <div className='cartControl_container'>
                                <Button
                                    style={'btn-danger'}
                                    onClick={() => dispatch(removeFromCart(item.productId))}
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </Button>
                                <Button
                                    style={'btn-primary'}
                                    onClick={() => dispatch(updateQuantityIncrease(item.productId))}
                                >
                                    +
                                </Button>
                                <span>{item.quantity}</span>

                                <Button
                                    style={'btn-secondary'}
                                    onClick={() => dispatch(updateQuantityDecrease(item.productId))}
                                >
                                    -
                                </Button>

                            </div>
                        </div>
                    ))

                }
            </div>
            <div className='orderBtn'>
                <Button style={'btn-primary'} onClick={() => { setIsOpen(true) }}>
                    Order
                </Button>
            </div>
            <PopUpLayout open={isOpen}>
                <div className=' flex flex-col justify-between gap-4'>
                    <p className='text-xl text-center'>
                        Are you sure you want to place this order?
                    </p>
                    <div className='flex gap-2 justify-center'>
                        <Button disabled={loading} style={'btn-primary'} onClick={handlePlaceOrder}>
                            {loading ? "Processing..." : "Order"}
                        </Button>
                        <Button onClick={() => setIsOpen(false)} style={'btn-secondary'}>
                            Cancle
                        </Button>

                    </div>
                </div>
            </PopUpLayout>
            {
                openToast ? (<Toast
                    message={message.text}
                    type={message.type}
                />) : (<></>)
            }
        </div>
    )
}