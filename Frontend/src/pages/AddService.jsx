import React, { useEffect, useState } from 'react'
import FormLayout from '../components/FormLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import axios from 'axios';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
export default function AddService({ isEditing = false, serviceId, setEditingMode }) {
    //variables & states
    const navigate = useNavigate()
    const [openToast, setOpenToast] = useState(false)
    const [serviceFormFields, setServiceFormFields] = useState([
        {
            name: 'title',
            value: '',
            placeholder: 'Service Name',
            type: 'text'
        },
        {
            name: 'description',
            value: '',
            placeholder: 'Description',
            type: 'text'
        },
        {
            name: 'duration',
            value: null,
            placeholder: 'Duration',
            type: 'number'
        },
        {
            name: 'price',
            value: null,
            placeholder: 'Price',
            type: 'number'
        },
    ])
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })

    useEffect(() => {
        if (isEditing && serviceId) {
            const fetchService = async () => {
                try {
                    const token = localStorage.getItem('mvec_token');

                    const res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/v1/api/services/${serviceId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    const serviceData = res.data.data;

                    setServiceFormFields(prev =>
                        prev.map(field => {
                            return {
                                ...field,
                                value: serviceData[field.name] ?? field.value
                            };
                        })
                    );

                } catch (err) {
                    console.error(err);
                }
            };

            fetchService();
        }
    }, [isEditing, serviceId]);

    // functions
    const resetServiceFormFields = () => {
        setServiceFormFields(prev =>
            prev.map(field => ({
                ...field,
                value:
                    field.type === 'number'
                        ? null
                        : ''       // text inputs
            }))
        );
    };
    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setServiceFormFields(prev =>
            prev.map(field =>
                field.name === fieldName
                    ? { ...field, value }
                    : field
            )
        );
    };
    // add function 
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {};
            serviceFormFields.forEach(field => {
                data[field.name] = field.value;
            });
            console.log(data);
            
            //get token from localStorage
            const token = localStorage.getItem('ssbms_token');
            //add product
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/api/services`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('services added:', response.data);
            resetServiceFormFields()
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);
        } catch (err) {
            console.error(err);
            setMessage({
                text: err.response.data.message,
                type: 'error'
            })
            setOpenToast(true);
        } finally {
            setTimeout(() => { setOpenToast(false) }, 3000);
        }
    };
    // edit function 
    const handleEditSubmit = async (e, serviceId) => {
        e.preventDefault();

        try {
            const updatedData = {};
            serviceFormFields.forEach(field => {
                updatedData[field.name] = field.value;
            });
            const token = localStorage.getItem('ssbms_token');

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/v1/api/services/${serviceId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage({
                text: response.data.message,
                type: 'success'
            })
            setOpenToast(true);

        } catch (err) {
            console.error(err);
            setMessage({
                text: err.response.data.message,
                type: 'error'
            })
            setOpenToast(true);
        } finally {
            setTimeout(() => { navigate('/services'), setOpenToast(false), setEditingMode(false) }, 3000);
        }
    };


    return (
        <div>
            {
                openToast ? (<Toast
                    message={message.text}
                    type={message.type}
                />) : (<></>)
            }
            <FormLayout
                full_H={!isEditing}
                onSubmit={(e) =>
                    isEditing
                        ? handleEditSubmit(e, serviceId)
                        : handleSubmit(e)
                }
            // enctype={'multipart/form-data'}
            >
                <h2 className='title'>{isEditing ? '' : 'Add Service'}</h2>
                {/* render inputs fields  */}
                {serviceFormFields
                    .filter(field => field.name !== 'categoryId')
                    .map(field => (
                        <Input
                            key={field.name}
                            value={field.value}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            accept={field.accept}
                            onChange={(e) => { handleInputChange(e, field.name) }}
                            id={field.id}
                        />
                    ))}

                <Button style={"btn-primary "}>
                    {isEditing ? 'Edit' : 'Add'}
                </Button>
            </FormLayout>
        </div>
    )
}
