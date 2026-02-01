import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import PopUpLayout from '../components/PopUpLayout'
import Loader from '../components/Loader'
export default function ProductDetails() {
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [images, setImages] = useState([])
    const [imageUrl, setImageUrl] = useState('')
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

    return (
        <div className='flex flex-col items-center '>
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
                            <div style={{paddingBottom:'1rem'}}>
                                <Button style={'btn-secondary'}>
                                    <div className="flex gap-2 items-center justify-center">
                                        <i className="fa-solid fa-bag-shopping"></i>
                                        <span>Add to card</span>
                                    </div>
                                </Button>
                            </div>

                        </>
                    )
            }
        </div>
    )
}
