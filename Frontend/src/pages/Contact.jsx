import FormLayout from '../components/FormLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import { useForm, ValidationError } from '@formspree/react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PopUpLayout from '../components/PopUpLayout'
export default function Contact() {

    const [contactData, setContactData] = useState({
        userName: '',
        email: '',
        message: ''
    })
    const [state, handleSubmit] = useForm("mwvbjqqj");
    if (state.succeeded) {
        return <PopUpLayout open={true}>
            <div className=' flex flex-col justify-between gap-4'>
                <p className='text-xl text-center'>
                    Thanks for reaching out! Your message
                    has been sent successfully.
                    We’ll contact you soon
                    <span className='text-green-500 text-4xl font-bold' dangerouslySetInnerHTML={{ __html: " &check;" }}></span>
                </p>
                <div className='flex gap-2 justify-center'>
                    <Link to={'/'}>
                        <Button style={'btn-primary'}>
                            Go to home
                        </Button>
                    </Link>
                    <div>
                        <Button onClick={() => window.location.reload()} style={'btn-secondary'}>
                            Send another message
                        </Button>
                    </div>

                </div>
            </div>
        </PopUpLayout>;
    }
    return (
        <div >
            <FormLayout
                onSubmit={handleSubmit}
            >
                <h2 className="title">Contact us</h2>
                <Input
                    type={'text'}
                    required
                    value={contactData.userName}
                    placeholder={'Name'}
                    name={'name'}
                    onChange={(e) => { setContactData(prev => ({ ...prev, userName: e.target.value })) }}
                />
                <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                />
                <Input
                    type={'email'}
                    required
                    value={contactData.email}
                    placeholder={'Email'}
                    name={'email'}
                    onChange={(e) => { setContactData(prev => ({ ...prev, email: e.target.value })) }}
                />
                <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                />
                <textarea
                    required
                    className='input'
                    value={contactData.message}
                    name='message'
                    placeholder={'Enter your message'}
                    onChange={(e) => { setContactData(prev => ({ ...prev, message: e.target.value })) }}
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                />
                <Button
                    disabled={state.submitting}
                    type={'submit'}
                    style={'btn-primary'}>
                    Send
                </Button>
            </FormLayout>
        </div>
    )
}
