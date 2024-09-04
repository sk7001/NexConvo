import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckPasswordPage() {
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
      const response = await axios.post("http://localhost:8000/api/password", user)
      console.log(response)
      toast.dismiss()
      toast.success(response.data.message)
      navigate("/user/messagepage")
      localStorage.setItem("token", response.data.token)
    } catch (error) {
      navigate("/email")
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