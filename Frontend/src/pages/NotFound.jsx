import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="center p-4 text-[var(--color-secondary)]  pt-50">
            <div className=" lg:w-150 w-full bg-white shadow-lg rounded-lg p-10 flex flex-col items-center gap-6">
                <h3 className="lg:text-9xl text-6xl font-bold">404</h3>
                <p className="text-gray-600 text-2xl text-center max-w-xs">
                    this page not found
                </p>
                <Button style={'btn-primary'} onClick={() => navigate('/')}>
                    Go to Home
                </Button>
            </div>
        </div>
    )
}
