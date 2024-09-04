import React from 'react'
import CheckEmailPage from '../CheckEmailPage'
import { Outlet } from 'react-router-dom'

export default function Auth() {
    return (
        <div>
            {localStorage.getItem("token") ? <Outlet /> : <CheckEmailPage />}
        </div>
    )
}
