import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import "./profile.css"
import toast from 'react-hot-toast';

export default function Profile() {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        profile_pic: '',
    })
    const getuser = useCallback(async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/userdetails`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setUserDetails({
            name: response.data.user.name,
            email: response.data.user.email,
            profile_pic: response.data.user.profile_pic,
        });
    }, [setUserDetails]);

    useEffect(() => {
        getuser();
    }, [getuser]);

    const handleOnChange = (event) => {
        setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
    }

    const handleOnSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/updateUserDetails`, {
                headers: { 'Authorization': `Bearer ${token}` }, userDetails})
            toast.success(response.data.message);
        } catch(error) {
            toast.error(error?.response?.data?.message);
        }

    }

    return (
        <div className='profilebody'>
            <img src={userDetails.profile_pic} alt={userDetails.name} className='profileimage' />
            <div className='profiletext'>
                <label>Name : <input type="text" value={userDetails.name} name='name' onChange={handleOnChange} /></label>
                <label>Email : <input type="email" value={userDetails.email} name="email" onChange={handleOnChange} disabled /></label>
            </div>
            <button onClick={handleOnSave}>Save</button>
        </div>
    )
}
