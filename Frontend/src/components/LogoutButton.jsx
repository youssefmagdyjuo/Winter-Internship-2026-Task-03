import Button from "./Button";
import {clearCart} from '../features/cart/cart'
import { useDispatch } from 'react-redux'

export default function LogoutButton() {
    const dispatch = useDispatch()
    const handleLogout = () => {
        // 1️⃣ مسح token و user
        localStorage.removeItem("mvec_token");
        localStorage.removeItem("mvec-user");
        localStorage.removeItem("mvec-email");
        dispatch(clearCart())
        // 2️⃣ redirect للـ Login
        location.replace("/login-signup");
    }

    return (
        <Button
            onClick={handleLogout}
            style={'btn-thirdary'}>
            <div className="flex gap-2 items-center justify-center">
                Logout
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
        </Button>
    );
}
