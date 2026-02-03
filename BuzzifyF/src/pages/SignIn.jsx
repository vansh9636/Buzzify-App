import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import Loading from '../components/Loading'
import { Constext } from '../context/Context'
import axiosInstance from '../Services/Axios.js'

const SignIn = () => {
  const navigate = useNavigate()
  const { loading, setloading, showpass, setshowpass, setuserData } = useContext(Constext);
  // const [showpass, setshowpass] = useState(false)
  const [signinUserdata, setsigninUserdata] = useState({
    email: "",
    password: ""
  })
  const handler = (e) => {
    setsigninUserdata({ ...signinUserdata, [e.target.name]: e.target.value })
  }
  const signinformHandle = (e) => {
    e.preventDefault();
    setloading(true)
    axiosInstance.post("/login", signinUserdata)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", JSON.stringify(res.data.token));
          setuserData(res.data.ResUserData);
          alert(res.data.msg);
          // console.log(res.data.ResUserData)
          setloading(false)
          navigate('/dash');
        }
      }).catch((err) => {
        setloading(false)
        if (err.response) {
          alert(err.response.data.msg)
        }
        else {
          alert(err.message)
        }
      });

  }
  return (
    <div className='h-screen py-2.5 px-5 ' id="signin-page">
      <img className='h-[7.6rem] z-1' id='logo' src="assets/logo.re.png" alt="" />
      <h2 className='text-[28px]'>Sign In</h2>
      <form className="flex flex-col items-start mt-10 gap-4" id='signin-form' onSubmit={signinformHandle}>
        <input
          className='text-[18px] py-2 w-full border-b border-gray-400 outline-none placeholder:text-[15px]'
          required
          type="email"
          placeholder='Email'
          name='email'
          value={signinUserdata.email}
          onChange={handler}
        />
        <div
          className="w-full flex relative password items-center">
          <input
            className='text-[18px] py-2 w-full border-b border-gray-400 outline-none placeholder:text-[15px]'
            required
            type={showpass ? "text" : "password"}
            placeholder='Password'
            name='password'
            value={signinUserdata.password}
            onChange={handler}
          />
          <span
            className='absolute right-0 text-lg  p-[5px] cursor-pointer'
            onClick={() => setshowpass(prev => !prev)}>{showpass ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}</span>
        </div>
        {/* <button
          className="self-end border-none text-[15px] text-[#003969]"  id='login-forgot'>Forgot password</button> */}
        <button
          className="text-[17px] w-full  py-[10px] border-none rounded-[5px] bg-[#13E9C0] mt-8 flax "
          type="submit" id='inbtn'>{loading ? <Loading size={5} /> : "Login"}</button>
      </form>
      <p className='text-[14px] mt-4 text-center text-zinc-500 ' >Need an account? <Link className='text-zinc-900' to={'/signup'} id='signin-up'>Sign up now!</Link></p>
    </div>
  )
}

export default SignIn