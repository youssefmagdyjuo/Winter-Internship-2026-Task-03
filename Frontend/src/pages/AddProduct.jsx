import React, { useEffect, useRef, useState } from 'react'
import FormLayout from '../components/FormLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import axios from 'axios';
import Selector from '../components/Selector';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../features/products/categories'
import { fetchCategories } from '../hooks/productsFetching';
import Toast from '../components/Toast';
export default function AddProduct({ isEditing = false, productId ,setEditingMode}) {
    //variables & states
    const dispatch = useDispatch()
    const [openToast, setOpenToast] = useState(false)
    const categories = useSelector((state) => state.categories) || [];
    const heroImageRef = useRef();
    const imagesRef = useRef();
    const [productFormFields, setProductFormFields] = useState([
        {
            name: 'title',
            value: '',
            placeholder: 'Product Name',
            type: 'text'
        },
        {
            name: 'description',
            value: '',
            placeholder: 'Description',
            type: 'text'
        },
        {
            name: 'categoryId',
            value: '',
            placeholder: 'Category',
            type: 'text',
        },
        {
            name: 'price',
            value: null,
            placeholder: 'Price',
            type: 'number'
        },
        {
            name: 'stock',
            value: null,
            placeholder: 'Stock',
            type: 'number'
        },
        {
            name: 'heroImage',
            value: '',
            type: 'file',
            accept: 'image/*',
            multiple: false
        },
        {
            name: 'images',
            value: [],
            type: 'file',
            accept: 'image/*',
            multiple: true
        }
    ])
    const heroImageField = productFormFields.find(f => f.name === 'heroImage');
    const imagesField = productFormFields.find(f => f.name === 'images');
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })
    //fetching categories
    useEffect(() => {
        const renderFun = async () => {
            const data = await fetchCategories()
            dispatch(getCategories(data))
        }
        renderFun()
    }, [])
    useEffect(() => {
        if (isEditing && productId) {
            const fetchProduct = async () => {
                try {
                    const token = localStorage.getItem('mvec_token');

                    const res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/v1/api/products/${productId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    const productData = res.data.data;

                    setProductFormFields(prev =>
                        prev.map(field => {
                            // متحطش الصور في file input
                            if (field.type === 'file') {
                                return {
                                    ...field,
                                    value: field.multiple ? [] : null
                                };
                            }

                            return {
                                ...field,
                                value: productData[field.name] ?? field.value
                            };
                        })
                    );

                } catch (err) {
                    console.error(err);
                }
            };

            fetchProduct();
        }
    }, [isEditing, productId]);

    //handle options to send it to selector
    const categoryOptions = categories.map(c => ({
        value: c._id,
        label: c.name
    }));

    // functions
    const resetProductFormFields = () => {
        setProductFormFields(prev =>
            prev.map(field => ({
                ...field,
                value:
                    field.type === 'file'
                        ? field.multiple
                            ? []      // multiple files
                            : null    // single file
                        : field.type === 'number'
                            ? null
                            : ''       // text inputs
            }))
        );
    };
    const handleInputChange = (e, fieldName) => {
        const value = fieldName === 'heroImage'
            ? e.target.files[0]           // one file
            : fieldName === 'images'
                ? Array.from(e.target.files) // multiple files
                : e.target.value;            // ather fields

        setProductFormFields(prev =>
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
            const formData = new FormData();
            productFormFields.forEach(field => {
                if (field.type !== 'file') {
                    formData.append(field.name, field.value);
                }
            });
            //add hero image
            const heroImageField = productFormFields.find(f => f.name === 'heroImage');
            if (heroImageField.value) {
                formData.append('heroImage', heroImageField.value);
            }
            //add product gallery
            const imagesField = productFormFields.find(f => f.name === 'images');
            imagesField.value.forEach(file => {
                formData.append('images', file);
            });
            //get token from localStorage
            const token = localStorage.getItem('mvec_token');
            //add product
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/api/products`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Product added:', response.data);
            resetProductFormFields()
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
    const handleEditSubmit = async (e, productId) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // append normal fields
            productFormFields.forEach(field => {
                if (field.type !== 'file') {
                    formData.append(field.name, field.value);
                }
            });

            const heroImageField = productFormFields.find(f => f.name === 'heroImage');
            if (heroImageField?.value) {
                formData.append('heroImage', heroImageField.value);
            }

            const imagesField = productFormFields.find(f => f.name === 'images');
            if (imagesField?.value?.length > 0) {
                imagesField.value.forEach(file => {
                    formData.append('images', file);
                });
            }

            const token = localStorage.getItem('mvec_token');

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/v1/api/products/${productId}`,
                formData,
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
            setTimeout(() => { setOpenToast(false) ,setEditingMode(false)}, 3000);
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
                        ? handleEditSubmit(e, productId)
                        : handleSubmit(e)
                }
                enctype={'multipart/form-data'}
            >
                <h2 className='title'>{isEditing ? '' : 'Add Product'}</h2>
                {/* render inputs fields  */}
                {productFormFields
                    .filter(field => field.name !== 'categoryId')
                    .map(field => (
                        <Input
                            key={field.name}
                            value={field.value}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            accept={field.accept}
                            multiple={field.multiple}
                            onChange={(e) => { handleInputChange(e, field.name) }}
                            ref={field.name === 'images' ? imagesRef : field.name === 'heroImage' ? heroImageRef : null}
                            style={field.name === 'images' || field.name === 'heroImage' ? { display: 'none' } : {}}
                            id={field.id}
                        />
                    ))}
                {/* choose category  */}
                <Selector
                    options={categoryOptions}
                    placeholder={"Select category..."}
                    onChange={(selected) =>
                        handleInputChange(
                            { target: { value: selected.value } },
                            'categoryId'
                        )}
                />
                {/* uploud hero image input */}
                <button className='add_file_input' type="button" onClick={() => heroImageRef.current.click()}>
                    {heroImageField.value
                        ? heroImageField.value.name
                        : <div className='flex gap-2 items-center'>
                            <i className="fa-solid fa-upload"></i>Upload Product Hero Image
                        </div>
                    }
                </button>

                {/* uploud product gallery input */}
                <button className='add_file_input' type="button" onClick={() => imagesRef.current.click()}>
                    {imagesField.value.length > 0
                        ? imagesField.value.map(file => file.name).join(', ')
                        : <div className='flex gap-2 items-center'>
                            <i className="fa-solid fa-upload"></i>Upload Product Gallery (1~5)
                        </div>
                    }
                </button>
                <Button style={"btn-primary "}>
                    {isEditing ? 'Edit' : 'Add'}
                </Button>
            </FormLayout>
        </div>
    )
}
