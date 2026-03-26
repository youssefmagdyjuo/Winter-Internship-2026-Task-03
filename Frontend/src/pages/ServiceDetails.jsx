import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import PopUpLayout from '../components/PopUpLayout'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import { getUserRole } from '../hooks/user'
import AddService from './AddService'
export default function ServiceDetails() {
    const token = localStorage.getItem('ssbms_token')
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [editingMode, setEditingMode] = useState(false)
    const [openToast, setOpenToast] = useState(false)
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const [service, setService] = useState({})
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })
    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/api/services/${id}`)
                const data = response.data.data
                setService(data)
                if (data) {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchService()
    }, [id])
    // delete service function
    const handleRemoveService = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/v1/api/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);
            setTimeout(() => { navigate('/services') }, 3000);
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
                        <section className='w-full mt-8'>
                            <h2 className='title text-center'>{service.title}</h2>
                            <table>
                                <tr>
                                    <th>Description:</th>
                                    <td>{service.description}</td>
                                </tr>
                                <tr>
                                    <th>Price:</th>
                                    <td>{service.price}$</td>
                                </tr>
                            </table>

                            {
                                userRole && userRole == 'customer'
                                    ? (<>
                                        <div className='flex gap-2 w-40 m-auto' style={{ paddingBottom: '1rem' }}>
                                            <Button style={'btn-secondary'} onClick={() => { }}>
                                                <div className="flex gap-2 items-center justify-center">
                                                    <i className="fa-solid fa-bag-shopping"></i>
                                                    <span>Request</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </>)
                                    : userRole && userRole == 'provider'
                                        ? (<>
                                            <div className="flex gap-2 justify-center w-80 m-auto">
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
                        </section>
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
                        {userRole == 'provider' ? 'Are you sure you want to remove this service ?' : ''}
                    </p>
                    <div className="flex gap-2 justify-center">
                        {
                            userRole && userRole == 'provider'
                                ? (<Button
                                    style="btn-danger"
                                    onClick={() => {
                                        handleRemoveService()
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
                    <AddService isEditing={true} serviceId={id} setEditingMode={setEditingMode} />
                </div>
            </PopUpLayout>
        </div>
    )
}
