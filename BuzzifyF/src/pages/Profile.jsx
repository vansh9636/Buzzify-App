import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ShowUserPost from "../components/ShowUserPost";
import EditProfile from "../components/EditProfile";
import { Constext } from '../context/Context';
import FollowNFollowingPage from "../components/FollowNFollowingPage";
import SavedPost from "../components/SavedPost";
import Loading from "../components/Loading";
import axiosInstance from '../Services/Axios.js';

const Profile = () => {
  const { id: userId } = useParams();
  const { userData } = useContext(Constext);
  const navigate = useNavigate()
  const [togglemenu, settogglemenu] = useState(false);
  const [toggleShowPosts, settoggleShowPosts] = useState(false);
  const [toggleEditProfile, settoggleEditProfile] = useState(false);
  const [togglefollowPage, settogglefollowPage] = useState(false)
  const [togglesavedpost, settogglesavedpost] = useState(false)
  const [userProfile, setUserProfile] = useState(null);
  const [showdp, setshowdp] = useState(false)
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await axiosInstance.get(`/user/getprofile/${userId}`);
        setUserProfile(res.data.userprofile);

      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    if (userId) getUserProfile();
  }, [userId]);
  async function logoutUser() {
    if (confirm("Are you sure to logout ⚠️")) {
      try {
        const res = await axios.get("http://localhost:8000/user/logout",
          { withCredentials: true },
        );
        if (res.data.success) {
          localStorage.removeItem("token");
          navigate('/signin');
        }
      } catch (error) {
        console.log("during logout : ", error)
      }
    }
  }
  return (
    <>
      {!userProfile ? <Loading /> : (
        <div className='relative h-screen  overflow-hidden w-full'>
          <div className='w-full h-full overflow-auto'>
            <nav className='sticky top-0 flex items-center  gap-4 px-1 py-2 bg-white/20  z-1'>
              <Link className='py-1 px-2  rounded' to={'/dash'} id='signin-up'> <i className="ri-arrow-left-line"></i></Link>
              <h3 className='flex-1 text-lg'>{userProfile.name || "Anonymous"} {userProfile._id === userData._id && <i className="ri-arrow-down-s-line"></i>}</h3>
              {userProfile._id === userData._id ? <><button className='py-1.5 px-5 bg-blue-500 text-sm text-white rounded-full' onClick={() => settoggleEditProfile(true)}>Edit</button> <button className='text-xl' onClick={() => settogglemenu(!togglemenu)}>
                {togglemenu ? <i className="ri-close-line"></i> : <i className="ri-menu-3-line"></i>}
              </button></> : ""}
            </nav>
            <div className='mt-6'>
              <img onClick={() => setshowdp(true)} className='w-30 m-auto h-30 rounded-full object-cover' src={userProfile.profilePic} alt="" />
              <h1 className='text-center text-2xl mt-3'>{userProfile.name || "Anonymous"}</h1>
              <h3 className='text-center text-sm text-gray-600 '>{userProfile.email || "example@example.com"}</h3>
              <div className='flex w-[93%] justify-around my-3 border-y-1 border-gray-600/30 py-2 mx-auto '>
                <span onClick={() => settoggleShowPosts(true)} className='text-center' >
                  <h3 className='text-[17px] font-bold'>{userProfile.posts.length || 0}</h3>
                  <h4 className='text-gray-600 text-sm'>Post</h4>
                </span>
                <span onClick={() => settogglefollowPage(true)} className='text-center' >
                  <h3 className='text-[17px] font-bold'>{userProfile.followers.length || 0}</h3>
                  <h4 className='text-gray-600 text-sm'>Follower</h4>
                </span>
                <span onClick={() => settogglefollowPage(true)} className='text-center' >
                  <h3 className='text-[17px] font-bold'>{userProfile.following.length || 0}</h3>
                  <h4 className='text-gray-600 text-sm'>Following</h4>
                </span>
              </div>
              <pre className='text-sm w-full  whitespace-pre-wrap leading-[17px] px-3 mt-1 '>
                {userProfile.bio || "Bio not set"}
              </pre>
            </div>
            <div className='mt-5'>
              <h1 className='text-lg my-2 ml-3'><i className="ri-layout-grid-line mr-1"></i>Posts</h1>
              <div id='posts' className=' w-full grid grid-cols-3 px-3 pb-3 gap-0.5'>

                {
                  (userProfile.posts.length > 0) ?
                    userProfile.posts.map((post, idx) => {
                      return (<div key={idx} onClick={() => settoggleShowPosts(true)} className='h-26 overflow-hidden'><img className='w-full h-full object-cover' src={`${post.image}`} alt="" /></div>)
                    })
                    : <h1 className='text-gray-600 text-sm ml-2' >Not post yet</h1>
                }
              </div>
            </div>
          </div>
          {/* profilePic */}

          <div className={`absolute w-full h-screen z-2 ${(toggleShowPosts) ? "top-0" : "top-[100%]"} left-0 bg-white  overflow-auto transition-all duration-300 ease `}>
            <ShowUserPost settoggleShowPosts={settoggleShowPosts} postdata={userProfile.posts} setUserProfile={setUserProfile} userId={userId} />
          </div>
          {/* editPage */}
          <div className={`absolute w-full h-screen z-2 ${toggleEditProfile ? "top-0" : "top-[100%]"} left-0 bg-white  duration-300 ease transition-all `}>
            <EditProfile toggleEdit={settoggleEditProfile} setUserProfile={setUserProfile} />
          </div>
          {/* MenuBardiv*/}
          {togglemenu && <div className='absolute right-1 top-12  w-[50%] h-1/2 bg-black/30 text-white overflow-hidden rounded'>
            <button onClick={() => { settogglesavedpost(true); settogglemenu(false) }} className='w-full flex items-center border-b-1 py-2 px-2  gap-x-1 text-xl bg-zinc-600/60'> <i className="ri-bookmark-line"></i><h5 className='text-lg '>Saved Posts</h5></button>
            <button onClick={() => logoutUser()} className='w-full flex items-center py-2 px-2  gap-x-1  text-lg  text-red-500 bg-zinc-200/70'> <i className="ri-logout-circle-r-line"></i> <h5 className='text-lg '>Log out</h5></button>
          </div>}
          {/* Follower&FollowingPage */}
          <div className={`absolute w-full h-screen z-2 ${togglefollowPage ? "top-0" : "top-[100%]"} left-0 bg-white overflow-auto  duration-300 ease transition-all `}>
            {/* <EditProfile toggleEdit={settoggleEditProfile} setUserProfile={setUserProfile} profiledata={userProfile} /> */}
            <FollowNFollowingPage togglefollowPage={settogglefollowPage} followerList={userProfile.followers} followingList={userProfile.following} />
          </div>
          {/*savedPost */}
          <div className={`absolute w-full h-screen z-2 ${togglesavedpost ? "top-0" : "top-[100%]"} left-0 bg-white  overflow-auto duration-300 ease transition-all `}>
            <SavedPost settogglesavedpost={settogglesavedpost} SavedPost={userProfile.saved} />
          </div>
          {/*showdp */}
          <div onClick={() => setshowdp(false)} className={`absolute w-full h-screen z-2 ${showdp ? "inset-0" : ""} backdrop-blur-sm flex items-center justify-center duration-300 ease transition-all `}>

            <img className='max-h-[80%] max-w-[90%] object-cover ' src={userProfile.profilePic} alt="" />
          </div>

        </div>

      )}
    </>
  )
};

export default Profile;
