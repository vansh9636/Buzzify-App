import { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import axiosInstance from "../Services/Axios.js";

export default function AddPost() {
  const fileInputRef = useRef(null);
  const Navigate = useNavigate();
  const [Postloading, setPostLoading] = useState(false);

  const [NewPost, setNewPost] = useState({
    imageFile: null,
    imagePreview: "",
    caption: ""
  });

  const changehandle = (e) => {
    const { value, files } = e.target;

    if (files) {
      const file = files[0];
      setNewPost((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    } else {
      setNewPost((prev) => ({ ...prev, caption: value }));
    }
  };

  const handleSubmit = async (e) => {
    setPostLoading(true);
    e.preventDefault();

    if (!NewPost.imageFile) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", NewPost.imageFile); // must match multer field name
    formData.append("caption", NewPost.caption);

    try {
      const response = await axiosInstance.post("/createpost",formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (response.data.success) {
        setPostLoading(false);
        Navigate('/dash');
        alert("Post created successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.msg || error.message);
    }
  };

  const reset = () => {
    setNewPost({
      imageFile: null,
      imagePreview: "", caption: ""
    });
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="flex gap-2 items-center border-b p-2">
          <Link className="py-1 px-2  rounded" to="/dash">
            <i className="ri-arrow-left-line"></i>
          </Link>
          <h2 className="text-xl font-semibold">New Post</h2>
        </div>

        <div className="w-full max-w-md py-2 px-4">
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Image Box */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="h-62 shadow rounded my-3 content-center overflow-hidden cursor-pointer"
            >
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={changehandle}
                ref={fileInputRef}
              />
              {NewPost.imagePreview ? (
                <img
                  className="w-full h-full object-cover"
                  src={NewPost.imagePreview}
                  alt=""
                />
              ) : (
                <h2 className="text-xl text-gray-600 text-center py-12">Click to select img</h2>
              )}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Caption
              </label>
              <textarea
                value={NewPost.caption}
                onChange={changehandle}
                name="caption"
                placeholder="Write a caption..."
                className="w-full px-3 py-2 border rounded"
                rows="3"
                required
              />
            </div>

            {/* Post Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Post
            </button>

            <button
              type="reset"
              onClick={reset}
              className="w-full bg-gray-600 text-white py-2 rounded"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
      {Postloading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
        <Loading msg="Posting..." />
      </div>}
    </>
  );
}
