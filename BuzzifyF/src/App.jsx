// import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dash from './pages/Dash'
import Notifition from './pages/Notification'
import Chat from './pages/Chat'
import AddPost from './pages/AddPost'
import Reels from './pages/Reels'
import Profile from './pages/Profile'
import StoryPage from './pages/StoryPage'
import ProtectRoute from './components/ProtectRoute'
import Search from './pages/Search'
const isLogonUser = localStorage.getItem("token") ? true : false;
const router = createBrowserRouter([
  {
    path: '/',
    element: isLogonUser ? <Dash /> : <Home />
  }, {
    path: '/signup',
    element: <SignUp />
  }, {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/dash',
    element: <ProtectRoute>
      <Dash />
    </ProtectRoute>
  },

  // {
  //   path: '/dash',
  //   element: <Dash />
  // },
  {
    path: '/storyPage',
    element: <StoryPage />
  },
  {
    path: '/notifition',
    element: <Notifition />
  },
  {
    path: '/chat',
    element: <Chat />
  },
  {
    path: '/addpost',
    element: <AddPost />
  },
  {
    path: '/search',
    element: <Search />
  },
  {
    path: '/reel',
    element: <Reels />
  },
  {
    path: '/profile/:id',
    element: <Profile />
  }

])
function App() {

  return (
    <div>
      <div className='fixed w-full h-2/5 bg-linear-to-b from-[#13E9C0]/40 top-0 left-0 -z-1 pointer-none:'></div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
