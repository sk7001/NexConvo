import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


export default function Login() {
    const [Step, setStep] = useState(0);
    return (
        <div>
            {Step === 0 && <CheckEmailPage setStep={setStep} />}
            {Step === 1 && <CheckPasswordPage />}
        </div>
    )
}


export function CheckEmailPage({ setStep }) {
    const [user, setuser] = useState({
        email: ""
    });
    const handleOnChange = (event) => {
        setuser({ ...user, [event.target.name]: event.target.value });
    }
    const handleOnClick = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/email`, user)
            localStorage.setItem("userId", response.data.checkEmail._id)
            localStorage.setItem("name", response.data.checkEmail.name)
            localStorage.setItem("profile_pic", response.data.checkEmail.profile_pic)
            console.log(response.data)
            toast.success(response.data.message)
            setStep(1)
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }
    return (
        <div className='mainwindow'>
            <div className='formwindow'>
                <h1>Enter your email</h1>
                <form className='form'>
                    <input type="email" name="email" value={user.email} onChange={handleOnChange} placeholder='Enter your email' />
                    <button onClick={handleOnClick} >Enter Password</button>
                    <Link to="/register" className='signin'>Signup?</Link>
                </form>
            </div>
        </div>
    )
}


export function CheckPasswordPage() {
    const profile_pic = localStorage.getItem("profile_pic")
    const name = localStorage.getItem("name")
    const localuserId = localStorage.getItem("userId")
    const navigate = useNavigate()
    const [user, setuser] = useState({
        password: "",
        userId: ""
    });
    const handleOnChange = (event) => {
        setuser({ userId: localuserId })
        setuser((user) => ({ ...user, [event.target.name]: event.target.value }));
    }
    const handleOnClick = async (e) => {
        e.preventDefault()
        try {
            toast.loading("Logging in...")
            console.log(user)
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/password`, user)
            console.log(response)
            toast.dismiss()
            toast.success(response.data.message)
            navigate("/user")
            localStorage.clear()
            localStorage.setItem("token", response.data.token)
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message)
            console.log(error.response.data.message)
        }
    }

    return (
        <div className='mainwindow'>
            <div className='formwindow'>
                <h2>Please enter your password</h2>
                <form className='form'>
                    {profile_pic && <img src={profile_pic} alt={name} />}
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleOnChange}
                        placeholder='Enter your password'
                    />
                    <button onClick={handleOnClick} >Register</button>
                    <Link to="/register" className='signin'>Signup?</Link>
                </form>
            </div>
        </div>
    )
}