import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotAuthorized() {
    const navigate = useNavigate();

    return (
        <div className="center p-4 text-[var(--color-secondary)]  pt-50">
            <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold">Not Authorized</h1>
                <p className="text-gray-600 text-center max-w-xs">
                    You do not have permission to access this page. Please contact the administrator if you believe this is an error.
                </p>
                <Button style={'btn-primary'} onClick={() => navigate('/')}>
                    Go to Home
                </Button>
            </div>
        </div>
    )
}
