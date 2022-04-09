import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

function NFTDropPage() {
    // Auth
    const connectWithMetamask = useMetamask()
    const address = useAddress()
    const disconnect = useDisconnect()
    // ---
  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 '>
        <div className='bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen '>
                <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
                    <img 
                        className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' 
                        src="https://links.papareact.com/8sg" 
                        alt="" 
                    />
                </div>
                <div className='text-center p-5 space-y-2'>
                    <h1 className="text-4 font-bold text-white">NFT Mining </h1>
                    <h2 className='text-xl text-gray-300'> A Full Stack NFT Mining Platform</h2>
                </div>
            </div>
        </div>
        {/* Right */}
        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
            {/* Header */}
            <header className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'> The{' '}
                    <span className='font-extrabold underline decoration-pink-600/50'>Web3
                    </span>{' '} 
                NFT Market Place
                </h1>
                <button
                    onClick={() => connectWithMetamask()} 
                    className='rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'>Sign In</button>
            </header>
            <hr className='my-2 border'/>

            {/* Content*/}
            <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
                <img 
                    className='w-80 objext-cover pb-10 lg:h-40' src="https://links.papareact.com/bdy" 
                    alt="" 
                />
                <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold"> Full Stack Club | The Drop
                </h1>

                <p className="pt-2 text-xl text-green-500"> 13 / 21 NFT's</p>
            </div>

            {/* Mint button*/}
            <button className='h-16 w-full rounded-full bg-red-600 text-white font-bold'>
                Mint NFT (0.01 ETH)
            </button>
        </div>
    </div>
    
  )  
}

export default NFTDropPage