import { React, useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { timeAgo } from '../Utils/utils';
import { Constext } from '../context/Context';
import Loading from './Loading';
import axiosInstance from '../Services/Axios.js';
const PostArray = ({ Postary, issetprofile, isNavlink }) => {
    const { userData, togglefollow, toggleSavePost } = useContext(Constext);
    const [toggledbox, settoggledbox] = useState(false)
    const [isextendCaption, setisextendCaption] = useState(null)
    const [Togglecommentbox, setTogglecommentbox] = useState(null)
    const [commentText, setcommentText] = useState("")
    const [newpostarr, setnewpostarr] = useState([]);
    const [deleteloading, setdeleteloading] = useState(false)

    useEffect(() => {
        setnewpostarr(Postary)
    }, [Postary]);


    async function likeOrUnlike(postId) {
        try {
            let res = await axiosInstance.get(`/like/${postId}`);
            if (res.data.islike) {
                setnewpostarr((prev) => (prev.map(item => {
                    return item._id === postId ? { ...item, likes: [...item.likes, userData._id] } : item
                })))
            }
            else {
                setnewpostarr((prev) => (prev.map(item => {
                    return item._id === postId ? { ...item, likes: item.likes.filter(likeduser => likeduser !== userData._id) } : item
                })))
            }
        } catch (error) {
            console.log("during likeorUnlike post ", error)
        }
    }

    // delete post 
    async function deletepost(postId) {
        if (confirm("do you want to delete this post ?")) {
            setdeleteloading(true)
            try {
                const res = await axiosInstance.delete(`/deletepost/${postId}`)
                if (res.data.success) {
                    setdeleteloading(false)
                    setnewpostarr((prev) => (prev.filter(item => item._id !== postId)))
                }
            } catch (error) {
                console.log("during the delete post : ", error)
            }
        }
    }
    async function commenthandler(e, postId) {
        e.preventDefault()
        try {
            const res = await axiosInstance.post(`/commentpost/${postId}`,
                { text: commentText });
            if (res.data.success) {
                setnewpostarr((prev) => (
                    prev.map((item, idx) => {
                        return item._id === postId ? res.data.post : item
                    })
                ))
                // console.log(res)
            }
            setcommentText("");
        } catch (error) {
            console.log("during the comment", error)
        }
    }
    return (
        <div className='pb-16 relative'>
            {
                (!newpostarr || newpostarr.length === 0) ? <div className='w-full h-full flex items-center justify-center text-gray-500 font-medium'>No Posts Yet</div> :
                    newpostarr.map((post, idx) => {
                        return (
                            <div key={idx} className="max-w-md py-1 mx-auto relative bg-white/20 border-b-1 border-gray-400 overflow-hidden">
                                <div className='flex items-center gap-2 px-2  py-2'>
                                    <img
                                        src={post.user.profilePic || " "}
                                        alt="User"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {isNavlink ? (<NavLink to={`/profile/${post.user._id}`} className=" flex-1 font-semibold text-gray-800">{post.user.name}</NavLink>) : (<h2 className="flex-1 font-semibold text-gray-800">{post.user.name}</h2>)}

                                    {userData._id !== post.user._id && (<button onClick={() => togglefollow(post.user._id)} className=' text-black border py-1 px-2 rounded mr-2'>
                                        {Array.isArray(userData.following) && userData.following.includes(post.user._id) ? "following" : "follow"}
                                    </button>)}
                                    {issetprofile &&
                                        <span className='text-lg font-bold' onClick={() => settoggledbox(toggledbox === idx ? null : idx)}><i className="ri-more-2-line"></i></span>
                                    }
                                </div>
                                <img
                                    src={`${post.image}`}
                                    alt="Post"
                                    className="w-full  object-cover"
                                />
                                {toggledbox === idx && (
                                    <div className={`absolute top-18 left-0 w-full h-1/2 bg-white/30 flex flex-col justify-center items-center px-5 space-y-2`}>
                                        <button className='text-white bg-blue-500 py-1.5 px-5 rounded w-full' onClick={() => { toggleSavePost(post._id); settoggledbox(null) }}>{userData.saved.includes(post._id) ? "Unsave " : "Save "}<i className='ri-save-fill'></i></button>
                                        <button className='text-white bg-red-500 py-1.5 px-5 rounded w-full' onClick={() => { deletepost(post._id); settoggledbox(false) }} >DELETE <i className="ri-delete-bin-6-line"></i></button>
                                    </div>
                                )}
                                <div className='px-2'>
                                    <div className='flex justify-between text-xl w-ful'>
                                        <div className='flex space-x-2'>
                                            <div onClick={() => likeOrUnlike(post._id)} className='flex items-center gap-0.5'>{post.likes.includes(userData._id) ? (<i className="ri-heart-3-fill text-red-500"></i>) : (<i className="ri-heart-3-line"></i>)}{post.likes.length !== 0 && (<span className='text-base -mt-0.5'>{post.likes.length}</span>)} </div>
                                            <div onClick={() => setTogglecommentbox(Togglecommentbox === idx ? null : idx)} className='flex items-center gap-0.5'><i className="ri-chat-3-line"></i><span className='text-sm -mt-0.5'>{post.comments.length}</span></div>
                                        </div>
                                        <button onClick={() => toggleSavePost(post._id)}>{Array.isArray(userData.saved) && <i className={`ri-bookmark-${userData.saved.includes(post._id) ? "fill" : "line"}`}></i>}</button>
                                    </div>
                                    <span onClick={() => setisextendCaption(isextendCaption === idx ? null : idx)} className='space-x-0.5'><h5 className='text-base inline'>{post.user.name}</h5> {isextendCaption === idx || post.caption.length < 30 ? (<p className='text-sm inline'>{post.caption}</p>) : (<p className='text-sm inline'>{post.caption.slice(0, 20)}<span className='text-gray-600'>...more</span></p>)}</span>
                                    <h6 className='text-xs text-gray-700 py-1'>{timeAgo(post.createdAt)}</h6>
                                    {
                                        Togglecommentbox === idx && (
                                            <div className='w-full pt-1 mt-2 h-60 flex flex-col'>
                                                {/* Scrollable comments */}
                                                <div className='flex-1 overflow-auto'>
                                                    {post.comments.length === 0 ? (
                                                        <p className='text-sm p-2'>No Comment Yet!</p>
                                                    ) : (
                                                        post.comments.map((comment, idx) => (
                                                            <div key={idx} className='flex gap-2 items-start p-1'>
                                                                <img
                                                                    src={comment.user.profilePic || " "}
                                                                    alt="User"
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                                <div className='flex-1'>
                                                                    <h2 className="text-sm font-semibold text-gray-800">{comment.user.name}</h2>
                                                                    <p className='text-xs'>{comment.text}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Input form fixed at bottom */}
                                                <div className='flex-shrink-0 p-1'>
                                                    <form className='flex' onSubmit={(e) => commenthandler(e, post._id)}>
                                                        <input
                                                            value={commentText}
                                                            type="text"
                                                            onChange={(e) => setcommentText(e.target.value)}
                                                            className='flex-1 p-1 text-sm outline-none'
                                                            placeholder={`Comment to ${post.user.name} ...`}
                                                            required
                                                        />
                                                        <button type='submit' className='py-1 text-base text-white px-4 rounded bg-indigo-600'>
                                                            <i className="ri-arrow-up-line"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>

                                        )
                                    }
                                </div>
                            </div>
                        )
                    })}
            {deleteloading && <div className="h-full absolute inset-0 bg-white/50  flex justify-center items-start pt-20">
                <div >
                    <Loading msg='Deleting...' />
                </div>
            </div>}
        </div>
    )
}

export default PostArray