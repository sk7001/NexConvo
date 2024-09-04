import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckEmailPage() {
  const navigate = useNavigate()
  const [user, setuser] = useState({
    email: ""
  });
  const handleOnChange = (event) => {
    setuser({ ...user, [event.target.name]: event.target.value });
  }
  const handleOnClick = async (event) => {
    event.preventDefault()
    try {
      toast.loading("Checking email...")
      const response = await axios.post("http://localhost:8000/api/email", user)
      localStorage.setItem("userId", response.data.checkEmail._id)
      localStorage.setItem("name", response.data.checkEmail.name)
      localStorage.setItem("profile_pic", response.data.checkEmail.profile_pic)
      console.log(response.data)
      toast.dismiss()
      toast.success(response.data.message)
      navigate('/password')
    } catch (error) {
      toast.dismiss()
      toast.success(error.response.data.message)
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