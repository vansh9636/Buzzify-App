import React, { useState, useContext, useRef } from "react";
import { Constext } from "../context/Context";
import Loading from "./Loading";
import axiosInstance from '../Services/Axios.js';

const EditProfile = ({ toggleEdit, setUserProfile }) => {
  const { userData, setuserData } = useContext(Constext);
  const [Editloading, setEditloading] = useState(false);
  const fileInputRef = useRef(null);
  // const profilePicPreview = userData?.profilePic;
  const [formData, setformData] = useState({
    name: userData?.name || "",
    bio: userData?.bio || "",
    profilePic: null,
    profilePicPreview: userData?.profilePic || null,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setformData((prev) => ({
        ...prev,
        profilePic: file,
        profilePicPreview: URL.createObjectURL(file),
      }));
    } else {
      setformData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditloading(true);
    const dataTosend = new FormData()
    dataTosend.append("name", formData.name);
    dataTosend.append("bio", formData.bio);

    if (formData.profilePic) {
      dataTosend.append("profilePic", formData.profilePic); // Actual file
    }

    try {
      const res = await axiosInstance.put("/editprofile", dataTosend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setUserProfile((prev) => ({
          ...prev,
          name: res.data.user.name,
          bio: res.data.user.bio,
          profilePic: res.data.user.profilePic,
        }));
        setuserData((prev) => ({
          ...prev,
          name: res.data.user.name,
          bio: res.data.user.bio,
          profilePic: res.data.user.profilePic,
        }));
        setEditloading(false);
        toggleEdit(false);
      }
      // close edit page
    } catch (error) {
      console.error("Error updating profile:", error);
    }

  };

  return (
    <div className="h-full relative">
      {/* Header */}
      <div className="flex gap-2 items-center border-b border-gray-300 p-2">
        <span
          onClick={() => toggleEdit(false)}
          className="py-1 px-2 bg-zinc-300/50 rounded cursor-pointer"
        >
          <i className="ri-arrow-left-line"></i>
        </span>
        <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
      </div>

      {/* Form */}
      <div className="w-full max-w-lg mx-auto h-full p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Profile Pic */}
          <div className="w-fit h-fit mx-auto relative">
            <span className="absolute bottom-1 right-1 text-2xl bg-blue-600 rounded-full px-1 text-white">
              <i className="ri-add-fill"></i>
            </span>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
            />
            <img
              src={formData.profilePicPreview}
              onClick={() => fileInputRef.current.click()}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover cursor-pointer"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Write something about yourself..."
              className="w-full px-4 py-1 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"

            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >Save Changes </button>
        </form>
      </div>
      {Editloading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
        <Loading msg="Updating..." />
      </div>}
    </div>
  );
};

export default EditProfile;
