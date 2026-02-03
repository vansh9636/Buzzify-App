import React from 'react'
import { useState } from 'react';
const BuzzifyBell = ({msg}) => {
   const [show, setShow] = useState(false);
  const [message] = useState("Profile Updated Successfully!");

  const trigger = () => {
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, 2000); // auto hide after 2 sec
  };

  return (
    <>
      <button
        onClick={trigger}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Show Notification
      </button>

      {/* Notification Box */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 
          bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg
          transition-all duration-500
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {message}
      </div>
    </>
  );
}

export default BuzzifyBell