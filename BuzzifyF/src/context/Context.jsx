import { createContext, useState, useEffect, } from 'react'
import axiosInstance from '../Services/Axios.js';
export const Constext = createContext();

const ConstextProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [showpass, setshowpass] = useState(false);
  const [userData, setuserData] = useState({})

  useEffect(() => {
    if (localStorage.getItem("token")) {
      async function getuserData() {
        await axiosInstance.get('/auth/Me')
          .then(res => {
            // console.log(res.data.UserData.posts)
            setuserData(res.data.UserData)
          }
          ).catch(err => {
            if (err.response.status === 401) {
              localStorage.removeItem("token")
            }
            console.log("error", err);
          })
      }
      getuserData();
    }
  }, [])


  // togglefollow&following
  async function togglefollow(NextGuyId) {
    try {
      const res = await axiosInstance.get(`/checkfollow/${NextGuyId}`
      );
      if (res.data.msg === "Unfollow") {
        setuserData((prev) => ({
          ...prev,
          following: prev.following.filter(followinguser => followinguser !== NextGuyId)
        }));
      }
      else (
        setuserData((prev) => ({ ...prev, following: [...prev.following, NextGuyId] }))
      )

    } catch (err) {
      console.error("Error fetching user :", err);
    }
  };

  //toggleSavePost
  async function toggleSavePost(postId) {
    try {
      let res = await axiosInstance.get(`/checksaved/${postId}`);
      if (res.data.isSaved) {
        setuserData((prev) => ({
          ...prev,
          saved: [...prev.saved, postId]
        }))
      }
      else {
        setuserData((prev) => ({
          ...prev,
          saved: prev.saved.filter(pId => pId !== postId)
        }))
      }
    } catch (error) {
      console.log("during saved image :", error);
    }
  }

  const contextValue = { loading, setloading, showpass, setshowpass, userData, setuserData, togglefollow, toggleSavePost };
  // console.log(userData)
  return (
    <Constext.Provider value={contextValue}>
      {children}
    </Constext.Provider>
  )
}

export default ConstextProvider