import React, { useEffect, useState } from 'react'
import { getUserRole } from '../../hooks/user'

export default function Dashboard() {
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    return (
        <div>
            {userRole}
        </div>
    )
}
