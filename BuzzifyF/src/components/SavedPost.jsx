import PostArray from './PostArray'

const SavedPost = ({ settogglesavedpost, SavedPost }) => {
    return (
        <>
            <div className="sticky top-0 z-2 bg-white flex gap-2 items-center border-b-1 border-gray-400 p-2">
                <span onClick={() => settogglesavedpost(false)} className=' py-1 px-2 bg-zinc-300/50 rounded'>
                    <i className="ri-arrow-left-line"></i>
                </span>
                <h2 className="text-xl font-semibold text-gray-800 "> Saved Posts</h2>
                
            </div>
            <div className='flex flex-col'>
                <PostArray Postary={SavedPost} settogglesavedpost={settogglesavedpost} isNavlink={false} />
            </div>
        </>
    )
}

export default SavedPost