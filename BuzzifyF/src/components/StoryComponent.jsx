import React from 'react'
import { Link } from 'react-router-dom'
const StoryPage = ({ profilePic }) => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <>
      <div
        className="w-full h-[80px] p-[2px] max-w-md mx-auto overflow-y-hidden whitespace-nowrap space-x-0.5"
        >
        {/* <Link to={'/storyPage'} className="relative w-[70px] h-[70px] rounded-full p-[2.5px] inline-block mx-[3px]">
          <img className="w-full h-full object-cover object-center rounded-full border-2 border-white"
            src={profilePic} alt="profilepic" />
            <button className="text-white text-[15px] py-[.5px] px-[4px] bg-[rgb(0,91,238)] absolute bottom-[-2px] right-[4px] border-none rounded-[50%]"
            ><i className="ri-add-line"></i></button>

        </Link>
        <Link to={'/storyPage'} className="inline-block whitespace-nowrap otherstory">
          {arr.map(item => <div key={item} className="border-orange-500 border-3 w-18 h-18 rounded-full inline-block mx-[3px]">
            <img className="w-full h-full object-cover object-center rounded-full border-2 border-white"
              src={profilePic} />
            
          </div>)}
        </Link> */}
        {arr.map((item, idx) => {
          return (<Link key={idx} to={'/storyPage'} className='inline-block rounded-full'>
            <div  className="border-orange-500 border-3 w-18 h-18 rounded-full inline-block mx-[3px]">
              <img className="w-full h-full object-cover object-center rounded-full border-2 border-white"
                src={profilePic} />
            </div>
          </Link>)
        })}

      </div>
    </>
  )
}

export default StoryPage