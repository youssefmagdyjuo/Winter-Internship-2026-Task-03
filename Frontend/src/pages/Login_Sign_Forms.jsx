import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import SwitchTogil from '../components/SwitchTogil';
import FormLayout from '../components/FormLayout';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
export default function Login_Sign_Forms() {

    const [formType, setFormType] = useState('login');
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });
    const handleLoginSubmit = async (e) => {
        // Handle login form submission
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/api/auth/login`, loginData);
            console.log('Login successful:', response.data);
            setLoginData({
                email: '',
                password: ''
            });
            localStorage.setItem("mvec_token", response.data.token);
            localStorage.setItem("mvec-user", JSON.stringify(response.data.data.name));
            localStorage.setItem("mvec-email", JSON.stringify(response.data.data.email));
            location.replace("/");
        } catch (error) {
            console.log(error);

        }
    }
    const handleSignupSubmit = async (e) => {
        // Handle signup form submission
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/api/auth/signup`, signupData);
            console.log('Signup successful:', response.data);
            setSignupData({
                name: '',
                email: '',
                password: '',
                role:'customer'
            });
            localStorage.setItem("mvec_token", response.data.token);
            localStorage.setItem("mvec-user", JSON.stringify(response.data.data.name));
            localStorage.setItem("mvec-email", JSON.stringify(response.data.data.email));
            location.replace("/");
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            console.error(error);
        }
    }
    return (
        <FormLayout>
            <SwitchTogil onClick={() => { setFormType(formType == 'signup' ? 'login' : 'signup') }}>
                <p className={formType == 'signup' ? 'text-white' : ''}>Sign up</p>
                <p className={formType == 'login' ? 'text-white' : ''}>Log in</p>
                <span className={formType == 'signup' ? 'left-0' : 'left-[calc(100%-10rem)]'}></span>
            </SwitchTogil>
            {
                formType == 'signup'
                    ? (
                        <>
                            <Input onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} value={signupData.name} placeholder="Name" required={true}/>
                            <Input onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} value={signupData.email} placeholder="Email" type='email'required={true}/>
                            <Input onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} value={signupData.password} placeholder="Password" type="password" required={true}/>
                            {/* Role Selection */}
                            <div className="radio-group">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Input
                                        onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                                        value={"customer"}
                                        type="radio"
                                        name="role"
                                        checked={signupData.role === 'customer'}
                                    />
                                    Customer
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Input
                                        onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                                        value={"seller"}
                                        type="radio"
                                        name="role"
                                        checked={signupData.role === 'seller'}
                                    />
                                    Seller
                                </label>
                            </div>
                            <Button onClick={handleSignupSubmit} style={'btn-primary'}>Sign Up</Button>
                        </>
                    )
                    : (
                        <>
                            <Input onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} value={loginData.email} placeholder="Email" type='email' required={true}/>
                            <Input onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} value={loginData.password} placeholder="Password" type="password" required={true}/>
                            {/* <div style={{ width: '10rem' }} > */}
                            <Button onClick={handleLoginSubmit} style={'btn-primary'}>Log In</Button>
                            {/* </div> */}
                        </>
                    )
            }
        </FormLayout>
    )
}

