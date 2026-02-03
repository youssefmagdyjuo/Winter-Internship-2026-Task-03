
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantityIncrease, updateQuantityDecrease } from '../features/cart/cart'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Button from '../components/Button'
import Input from '../components/Input'


export default function Cart() {
    const [quantity, setQuantity] = useState(1)
    const { items } = useSelector((state) => state.cart)

    const dispatch = useDispatch()

    if (items.length === 0) {
        return <h2>Your cart is empty</h2>
    }

    return (
        <div>
            <div className="Products_container">
                {
                    items.map((item, index) => (
                        <div className='flex flex-col gap-4'>
                            <Link to={`/products/${item.productId}`} key={index}>
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
        </div>
    )
}