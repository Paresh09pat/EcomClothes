import React from 'react'

const Loader = () => {
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-10 z-50 flex items-center justify-center backdrop-blur-sm">

                <div className="flex-col gap-4 w-full flex items-center justify-center">
                    <div
                        className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                    >
                        <div
                            className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                        ></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loader