import React, { useState } from 'react'
import FormLayout from './FormLayout';
import Input from './Input';
import Button from './Button';
import axios from 'axios';

export default function CreateNewUser({token}) {
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });
    const handleCreateNewUser = async (e) => {
        // Handle signup form submission
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.BACKEND_BASEURL}/v1/api/users`, signupData,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Signup successful:', response.data);
            setSignupData({
                name: '',
                email: '',
                password: '',
                role: 'customer'
            });
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            console.error(error);
        }
    }
    return (
        <div>
            <FormLayout full_H={false}>
                <Input onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} value={signupData.name} placeholder="Name" />
                <Input onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} value={signupData.email} placeholder="Email" />
                <Input onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} value={signupData.password} placeholder="Password" type="password" />
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

                    <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                            value={"admin"}
                            type="radio"
                            name="role"
                            checked={signupData.role === 'admin'}
                        />
                        admin
                    </label>
                </div>
                <Button onClick={handleCreateNewUser} style={'btn-primary'}>Create</Button>
            </FormLayout>
        </div>
    )
}
