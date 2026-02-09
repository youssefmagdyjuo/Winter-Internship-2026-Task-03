import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from '../hooks/user';

const AuthRoute = ({ role }) => {
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    if (!userRole) return <div>Loading...</div>;
    if (role == userRole) {
        return <Outlet />
    } else {
        return <Navigate to="/notAuthorized" />
    }

};

export default AuthRoute;