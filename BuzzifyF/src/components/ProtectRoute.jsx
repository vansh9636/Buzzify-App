// here is use protect route
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, Outlet } from 'react-router-dom'
const ProtectRoute = ({ children }) => {
    const [isLoggedIn, setisLoggedIn] = useState(true)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setisLoggedIn(false);
                    return;
                }
            } catch (error) {
                setisLoggedIn(false);
            }
        };
        checkAuth();
        // console.log(Outlet())
    }, [])
    return (
        <div>
            {isLoggedIn ? children : <Navigate to="/signin" />}
        </div>
    )
}

export default ProtectRoute