import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import axios from 'axios'
import Loading from '../components/Loading'
import { Constext } from '../context/Context'
import axiosInstance from '../Services/Axios'

const SignUp = () => {
  const navigate = useNavigate()
  const { loading, setloading, showpass, setshowpass, setuserData } = useContext(Constext);
  // const [showpass, setshowpass] = useState(false)
  const [signupUserdata, setsignupUserdata] = useState({
    name: "",
    email: "",
    password: ""
  })
  async function signupSubmit(e) {
    e.preventDefault();
    setloading(true);
    await axiosInstance.post("/register", signupUserdata)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", JSON.stringify(res.data.token));
          setuserData(res.data.newuser);
          alert(res.data.msg);
          setloading(false);
          navigate('/dash');
        }
      }).catch((err) => {
        setloading(false);
        if (err.response) {
          alert(err.response.data.msg)
        }
        else {
          alert(err.message)
        }
      });
  }

  function handlear(e) {
    setsignupUserdata({ ...signupUserdata, [e.target.name]: e.target.value })
  }
  return (
    <>
      <div className='h-screen py-2.5 px-5' id="signup-page">
        <img className='h-[7.6rem]' id='logo' src="src/assets/images/logo.re.png" alt="" />
        <h2 className='text-[28px]'>Sign Up</h2>
        <form className="flex flex-col items-start mt-10 gap-4" id='signup-form' onSubmit={signupSubmit}>
          <input
            className='text-[18px] py-2 w-full border-b border-gray-400 outline-none placeholder:text-[15px]'
            required
            type="text"
            id="username"
            placeholder='Name'
            name='name'
            minLength='3'
            maxLength="20"
            value={signupUserdata.name}
            onChange={handlear} />

          <input
            className='text-[18px] py-2 w-full border-b border-gray-400 outline-none placeholder:text-[15px]'
            required
            type="email"
            id="email"
            placeholder='Email'
            name="email"
            value={signupUserdata.email}
            onChange={handlear} />

          <div className="w-full flex relative password items-center">
            <input
              className='text-[18px] py-2 w-full border-b border-gray-400 outline-none placeholder:text-[15px]'
              required
              type={showpass ? "text" : "password"}
              id="password"
              placeholder='Password'
              name="password"
              minLength="4"
              max="10"
              value={signupUserdata.password}
              onChange={handlear} />
            <span className='absolute right-0 text-lg  p-[5px] cursor-pointer' onClick={() => setshowpass(prev => !prev)}>{showpass ? <i className=" ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}</span>
          </div>

          <button
            className="text-[17px] w-full py-[10px] border-none rounded-[5px] bg-[#13E9C0] mt-8"
            type="submit" id='upbtn'>{loading ? <Loading size={5} /> : "Sign Up"}</button>
        </form>
        <p className='text-[14px] mt-4 text-center text-zinc-500 '>Already have a account? <Link className='text-zinc-900' id='signup-login' to={'/signin'}>Log in</Link> </p>
      </div>
    </>
  )
}

export default SignUp