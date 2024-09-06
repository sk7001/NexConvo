import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Login from '../Login'

export default function Auth() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    if (token) {
        return <Outlet />
    }
    else {
        navigate("/login")
        return <Login />
    }
}