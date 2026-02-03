import { React, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Constext } from '../context/Context'


const BottomNav = ({ profilePic }) => {
  const {userData, getuserprofile } = useContext(Constext);
  return (
    <div className="w-full h-[65px] fixed px-[5px]  left-0 bottom-0 z-3 bg-transparent flex items-center gap-2"
      id='bottomnav'>
      <div
        className='flex-1 w-1/2 flex justify-around items-center bg-white p-2 rounded-full text-2xl shadow-2xl bottomNav'>
        <NavLink to='/dash'>
          <i className="ri-home-5-line text-gray-600"></i>
        </NavLink>
        <NavLink to='/search'>
          <i className="ri-search-line text-gray-600"></i>
        </NavLink>
        <NavLink to='/reel'>
          <i className="ri-vidicon-line text-gray-600"></i>
        </NavLink>
        <NavLink to={`/profile/${userData._id}`} className='w-[30px] h-[30px] rounded-full overflow-hidden'>
          <img className='w-full h-full object-cover' src={profilePic} alt="" />
        </NavLink>
        {/* <div className='w-[30px] h-[30px] rounded-full overflow-hidden '>
        </div> */}
      </div>
      <NavLink to='/addpost' className='h-[50px] w-[50px] text-2xl flex justify-center items-center bg-[#13E9C0] text-[#095a4b] rounded-full'>
        <i className="ri-add-fill"></i>
      </NavLink>
    </div>
  )
}

export default BottomNav