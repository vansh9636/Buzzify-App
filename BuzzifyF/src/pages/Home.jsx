import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <>
      <div
        className="h-screen bg-cover bg-center flex flex-col items-start justify-between" style={{ backgroundImage: "url('public/assets/welcome_img.jpeg')" }} id='home-page'>
        <img className='h-[7.6rem]' id='logo' src="public/assets/logo.re.png" alt="logo" />
        <div className="w-full p-[13px] bg-gray-100" id="startSection">
          <h1 className='text-[1.5em] capitalize mb-[1rem]'>Get started with Buzzify</h1>
          <Link
            className="p-[10px] text-[1.1em] bg-black text-white border-none rounded-[5px] flex items-center justify-center no-underline relative"
            to={'/signup'} id='startbtn'>Continue <i className="absolute right-3 text-xl ri-arrow-right-line animate-pulse"></i></Link>
        </div>
      </div>
    </>
  )
}

export default Home