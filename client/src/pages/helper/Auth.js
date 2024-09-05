import React from 'react'
import { Outlet } from 'react-router-dom'
import Login from '../Login'

export default function Auth() {
    const token = localStorage.getItem("token")
    return (
        <div>
            {token ? <Outlet /> : <Login />}
        </div>
    )
}
