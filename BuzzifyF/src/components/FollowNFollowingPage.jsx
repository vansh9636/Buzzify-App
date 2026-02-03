import { React, useState } from 'react'
import { NavLink } from 'react-router-dom'
const FollowNFollowingPage = ({ togglefollowPage, followerList, followingList }) => {
    const [isActive, setisActive] = useState("follower")
    // console.log(followingList)
    return (
        <>
            <div className="sticky top-0 z-2 bg-white flex gap-2 items-center border-b-1 border-gray-400 p-2">
                <span onClick={() => togglefollowPage(false)} className=' py-1 px-2 bg-zinc-300/50 rounded'>
                    <i className="ri-arrow-left-line"></i>
                </span>
                <h2 className="text-xl font-semibold text-gray-800 ">Connectors</h2>
            </div>
            <div className='w-full h-screen overflow-y-auto'>
                <div className='sticky top-0 z-2 flex bg-zinc-300'>
                    <span onClick={() => setisActive("follower")} className={`w-1/2 h-full py-2 px-1 text-center capitalize text-lg ${isActive === "follower" && "border-b-2 "}`}>follower</span>
                    <span onClick={() => setisActive("following")} className={`w-1/2 h-full py-2 px-1 text-center capitalize text-lg ${isActive === "following" && "border-b-2"}`}>follwoing</span>
                </div>

                {isActive === "follower" && (<div>
                    {!followerList.length == 0 ? followerList.map((follower, idx) => {
                        return (<div key={idx} className='flex items-center gap-2 px-2  py-3'>
                            <img
                                src={follower.profilePic || " "}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <NavLink onClick={() => togglefollowPage(false)} to={`/profile/${follower._id}`} className=" flex-1 font-semibold text-gray-800">{follower.name}</NavLink>
                            {/* {(userData._id === post.user._id) ? <></> : <button className=' text-black border py-1 px-3 rounded mr-2'>follow</button>} */}
                            <span className='text-lg font-bold'><i className="ri-more-2-line"></i></span>
                        </div>)
                    }) : (<h4 className='text-gray-500 px-2 py-1'>No follower</h4>)}
                </div>)}
                {isActive === "following" && (<div>
                    {!followingList.length == 0 ? followingList.map((following, idx) => {
                        return (<div key={idx} className='flex items-center gap-2 px-2  py-3'>
                            <img
                                src={following.profilePic || " "}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <NavLink onClick={() => togglefollowPage(false)} to={`/profile/${following._id}`} className=" flex-1 font-semibold text-gray-800">{following.name}</NavLink>
                            {/* {(userData._id === post.user._id) ? <></> : <button className=' text-black border py-1 px-3 rounded mr-2'>follow</button>} */}
                            <span className='text-lg font-bold'><i className="ri-more-2-line"></i></span>
                        </div>)
                    }) : (<h4 className='text-gray-500 px-2 py-1'>No follwoing</h4>)}
                </div>)}

            </div>

        </>
    )
}

export default FollowNFollowingPage