import React, { useState } from 'react'
import "./style.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import toast from "react-hot-toast"

export default function RegisterPage() {
  const [profilepic, setprofilepic] = useState(null)
  const [preview, setpreview] = useState("https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Clipart.png")
  const navigate = useNavigate()
  const [user, setuser] = useState({
    name: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
  });
  function previewfile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setpreview(reader.result)
      setprofilepic(reader.result)
      console.log(profilepic)
    }
  }

  const handleOnChange = (event) => {
    setuser({ ...user, [event.target.name]: event.target.value })
  }

  const handleOnImage = (event1) => {
    const file = event1.target.files[0];
    previewfile(file)
  };

  const handleOnClick = async (event) => {
    event.preventDefault()
    try{
      toast.loading("Resistering user")
      console.log({ user, profilepic })
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/register`, { user, profilepic })
      console.log(response.data)
      toast.dismiss()
      toast.success(response.data.message)
      navigate("/login")
    }catch(error){
      toast.dismiss()
      toast.error(error.response.data.message)
      console.log(error)
    }

  }
  return (
    <div className='mainwindow'>
      <div className='formwindow'>
        <h1>Register Page</h1>
        <form className='form'>
          <img src={preview} alt="" />
          <label htmlFor='profile_pic'>
            <div className='button'>Upload your profile picture</div>
            <input type="file" name='profile_pic' id='profile_pic' onChange={handleOnImage} hidden />
          </label>
          <input type="text" name="name" value={user.name} onChange={handleOnChange} placeholder='Enter your name' />
          <input type="tel" name="phone" value={user.phone} onChange={handleOnChange} placeholder='Enter your phone number' />
          <select name="gender" value={user.gender} onChange={handleOnChange}>
            <option value="" disabled>Please select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="other">Others</option>
          </select>
          <input type="email" name="email" value={user.email} onChange={handleOnChange} placeholder='Enter your email' />
          <input type="password" name="password" value={user.password} onChange={handleOnChange} placeholder='Enter your password' />
          <button onClick={handleOnClick} >Register</button>
          <Link to="/login" className='signin'>Signin?</Link>
        </form>
      </div>
    </div >
  )
}
