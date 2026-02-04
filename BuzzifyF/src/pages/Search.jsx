import { useState, useEffect } from 'react'
import { Link,NavLink } from 'react-router-dom'
import axios from "axios"
import axiosInstance from '../Services/Axios.js'
const Search = () => {
    const [searchedUser, setsearchedUser] = useState([]);
    const [inputval, setinputval] = useState("");
    useEffect(() => {
        async function fatchUserdata() {
            try {
                const res = await axiosInstance.get("/user/getalluser");
                if (res.data.success) {
                    setsearchedUser(res.data.searchedUser)
                }
                // console.log(res)
            } catch (error) {
                console.log("during fatch all user ", error);
            }
        }
        fatchUserdata();
    }, [])
    const filteredArray = inputval.trim() === "" ? [] : searchedUser.filter(user => {
        return user.name.toLowerCase().startsWith(inputval.toLowerCase())
    })
    // console.log(filteredArray)
    return (
        <div className='relative flex flex-col h-screen overflow-auto'>
            <nav className='sticky top-0 flex items-center gap-2 px-1 py-2 z-1 bg-white/50 '>
                <Link className='py-1 px-2 bg-zinc-300/50 rounded cursor-pointer' to={'/dash'} id='signin-up'> <i className="ri-arrow-left-line"></i></Link>
                <div
                    className='border w-full px-2 py-1.5 rounded-full flex gap-2 '>
                    <i className="ri-search-line text-gray-600"></i>
                    <input
                        type="text"
                        value={inputval}
                        onChange={(e) => setinputval(e.target.value)}
                        placeholder='Search Users'
                        className='flex-1 focus:outline-none' />
                </div>
            </nav>
            <div className='flex-1 px-1 pt-1'>
                {filteredArray.map(item => (
                    <div className='flex items-center gap-2 px-2  py-2 bg-zinc-400/20 rounded'>
                        <img
                            src={item.profilePic || " "}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <NavLink to={`/profile/${item._id}`} className=" flex-1 font-semibold text-gray-800">{item.name}</NavLink>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search