import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import PopUpLayout from '../components/PopUpLayout'
import Input from '../components/Input'
import axios from 'axios'
import { clearCart } from '../features/cart/cart'
import { useDispatch } from 'react-redux'
import Toast from '../components/Toast'
import CreateNewUser from '../components/CreateNewUser'
import { getUserRole } from '../hooks/user'
import ProductsManagement from './ProductsManagement'
export default function Profile() {
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    const userName = JSON.parse(localStorage.getItem('mvec-user'))
    const userEmail = JSON.parse(localStorage.getItem('mvec-email'))
    const token = localStorage.getItem('mvec_token')
    const [isOpen, setIsOpen] = useState(false)
    const [openToast, setOpenToast] = useState(false)
    const [view, setView] = useState('')
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })
    const dispatch = useDispatch()
    const [currentPass, setCurrentPass] = useState('')
    const [newPass, setNewPassPass] = useState('')
    const handleLogout = () => {
        localStorage.removeItem("mvec_token");
        localStorage.removeItem("mvec-user");
        dispatch(clearCart())
        location.replace("/login-signup");
    }
    const handleChangePass = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/v1/api/users/update-password`,
                {
                    currentPassword: currentPass,
                    newPassword: newPass
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);
            setTimeout(() => { handleLogout() }, 3000);
        } catch (error) {
            console.log(error)
            setMessage({
                text: error.response.data.message,
                type: 'error'
            })
            setOpenToast(true);
        } finally {
            //close PopUpLayout
            setIsOpen(false)
            setTimeout(() => { setOpenToast(false) }, 3000);
        }
    }
    return (
        <div className='p-4'>
            <div className="profileBoxControl">
                <div className="info_container">
                    <div className='img_container center'>
                        <i className={`center flex  fa-solid fa-user`}></i>
                    </div>
                    <table className="info">
                        <tr>
                            <td>Name:</td>
                            <td>{userName}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>{userEmail}</td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td><input type="password" value='************' /></td>
                            <td onClick={() => setIsOpen(true)}><p className='text-[var(--color-primary)]'>edit</p></td>
                        </tr>
                    </table>
                </div>
                <div className="controlersBox">
                    <h3 className='font-bold'>Controllers:</h3>
                    {
                        userRole && userRole == 'admin'
                            ? (<>
                                <p onClick={() => { setView('create_new_user') }}>Create new user</p>
                                <p onClick={() => { setView('site_mode') }}>Site Mode</p>
                            </>)
                            : userRole && userRole == 'seller'
                                ? (<>
                                    <p onClick={() => { setView('seller_product') }}>My Products</p>
                                </>)
                                : userRole && userRole == 'customer'
                                    ? (<>customer</>)
                                    : (<></>)
                    }

                </div>
            </div>
            <div className='h-[2px] bg-[var(--gray)] w-[50%] mb-8 m-auto rounded'></div>
            <div className="profileChangingBox">
                {
                    view == 'create_new_user'
                        ? (<CreateNewUser token={token} />)
                        : view == 'seller_product'
                            ? (<ProductsManagement statusType={''} />)
                            : (<></>)
                }
            </div>
            <PopUpLayout open={isOpen}>
                <div className="flex flex-col justify-between gap-4">
                    <p className="text-xl text-center">
                        Change your password
                    </p>
                    <Input
                        type={'password'}
                        value={currentPass}
                        placeholder={'Current password'}
                        onChange={(e) => { setCurrentPass(e.target.value) }}
                    />
                    <Input
                        type={'password'}
                        value={newPass}
                        placeholder={'New password'}
                        onChange={(e) => { setNewPassPass(e.target.value) }}
                    />
                    <div className="flex gap-2 justify-center">
                        <Button
                            style="btn-primary"
                            onClick={handleChangePass}
                        >
                            Update
                        </Button>

                        <Button
                            style="btn-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            cancle
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
