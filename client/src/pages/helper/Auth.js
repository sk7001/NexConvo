import React from 'react'
import { Outlet } from 'react-router-dom'
import Login from '../Login'

export default function Auth() {
    return (
        <div>
            {localStorage.getItem("token") ? <Outlet /> : <Login />}
        </div>
    )
}
