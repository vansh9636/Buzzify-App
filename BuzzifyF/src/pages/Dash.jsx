import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import StoryCompo from '../components/StoryComponent';
import BottomNav from '../components/BottomNav';
import img from '../assets/images/download.png'
import { Constext } from '../context/Context';
import Loading from '../components/Loading';
import PostArray from '../components/PostArray';
import BuzzifyBell from '../components/BuzzifyBell';
import axiosInstance from '../Services/Axios.js';
const Dash = () => {
  const { userData, } = useContext(Constext);
  const navigate = useNavigate();
  const [allposts, setallposts] = useState(null)


  // onreload then work a useEffect 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/allpost");
        setallposts(res.data.posts);
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/signin")
        }
        navigate("/signin")
        console.error("Error fetching posts:", err);

      }
    };
    fetchPosts();
  }, [])
  return (
    <>
      <div className="flex flex-col pt-[5px] overflow-auto relative h-screen ">
        <div
          className="flex items-center justify-between p-[5px] overflow-hidden" id='topnav'>
          <img className="h-10 w-28 object-cover rounded-3xl shadow-lg"
            src={img} alt="logo" />

          <div className='notify-msg space-x-1'>
            <Link className="text-[20px] py-1 px-2 shadow-lg  text-black inline  relative bg-white rounded-2xl  after:content-[''] after:p-[5px] after:bg-orange-500 after:absolute after:rounded-full after:-top-[4px] after:right-[10%] after:hidden"
              to={'/notifition'} ><i className="ri-heart-2-line"></i></Link>
            <Link className="text-[20px] py-1 px-2 shadow-lg text-black inline   relative bg-white rounded-2xl  after:content-[''] after:p-[5px] after:bg-orange-500 after:absolute after:rounded-full after:-top-[4px] after:right-[10%] after:hidden"
              to={'/chat'} ><i className="ri-messenger-line"></i></Link>
          </div>
        </div>
        <div className="w-full flex-1 overflow-y-auto pb-16">
          <StoryCompo profilePic={userData.profilePic} />
          <div className='w-full h-full border-t-1' >
            {
              (!allposts) ? <Loading size={5} /> :
                <PostArray Postary={allposts} isNavlink={true} />
            }
          </div>
        </div>
        <BottomNav profilePic={userData.profilePic} />
        {/* <BuzzifyBell /> */}
      </div>
    </>
  )
}

export default Dash
