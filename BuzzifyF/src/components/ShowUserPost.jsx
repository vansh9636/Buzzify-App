import { useContext, useState } from 'react'
import { Constext } from '../context/Context'
import { timeAgo } from '../Utils/utils'
import PostArray from './PostArray'
const ShowUserPost = ({ settoggleShowPosts, postdata, userId }) => {
    const { userData } = useContext(Constext)
    return (
        <>
            <div className="sticky top-0 z-2 bg-white flex gap-2 items-center border-b-1 border-gray-400 p-2">
                <span onClick={() => settoggleShowPosts(false)} className=' py-1 px-2 bg-zinc-300/50 rounded'>
                    <i className="ri-arrow-left-line"></i>
                </span>
                <h2 className="text-xl font-semibold text-gray-800 ">Posts</h2>
            </div>

            <div className='flex flex-col'>
                <PostArray Postary={postdata} issetprofile={userData._id === userId ? true : false} />
            </div >

        </>
    )
}

export default ShowUserPost