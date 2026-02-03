import React from 'react'
import { Link } from 'react-router-dom'
import Notifition from './Notification'
const TopNav = () => {
    return (
        <div id='topnav'>
            <img className='topNlogo' src="src/assets/images/logo.re.png" alt="logo" />
           <div className='notify-msg'>
           <Link className='topnavbtn' to={'/notifition'} ><i className="ri-heart-2-line"></i></Link>
           <Link className='topnavbtn'  to={'/chat'} ><i className="ri-messenger-line"></i></Link>
           </div>
        </div>
       
    )
}

export default TopNav