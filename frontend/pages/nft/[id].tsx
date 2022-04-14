import React, { useEffect, useState} from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typing';
import { BigNumber} from 'ethers'

interface Props {
    collection: Collection
}
function NFTDropPage({collection}: Props) {
    const [claimedSupply, setClaimedSupply] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<BigNumber>()
    const nftDrop = useNFTDrop(collection.address)
    const [loading, setLoading] = useState(true)

    // Auth
    const connectWithMetamask = useMetamask()
    const address = useAddress()
    const disconnect = useDisconnect()
    // ---

    useEffect(() => {
        if (!nftDrop) return

        const fetchNFTDropData = async () => {
            setLoading(true)
            const claimed = await nftDrop.getAllClaimed()

            const total = await nftDrop.totalSupply()

            setClaimedSupply(claimed.length)
            setTotalSupply(total)

            setLoading(false)
        }

        fetchNFTDropData()
    }, [nftDrop])
    


  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 '>
        <div className='bg-gradient-to-br from-cyan-800 to-zinc-900 lg:col-span-4'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen '>
                <div className="rounded-xl bg-gradient-to-br from-violet-800 to-yellow-600 p-2">
                    <img 
                        className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' 
                        src={urlFor(collection.previewImage).url()}
                        alt="" 
                    />
                </div>
                <div className='text-center p-5 space-y-2'>
                    <h1 className="text-4 font-bold text-white">{collection.nftCollectionName}</h1>
                    <h2 className='text-xl text-gray-300'> {collection.description}</h2>
                </div>
            </div>
        </div>
        {/* Right */}
        <div className='flex flex-1 flex-col bg-gradient-to-br from-green-900 to-zinc-900 p-12 lg:col-span-6'>
            {/* Header */}
            <header className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'> The{' '}
                    <span className='font-extrabold underline decoration-slate-100/50'>Web3
                    </span>{' '} 
                NFT Market Place
                </h1>
                <button
                    onClick={() => connectWithMetamask()} 
                    className='rounded-full bg-violet-800 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base'
                >
                    {address ? 'Sign Out' : 'Sign In'}
                </button>
            </header>
            <hr className='my-2 border'/>
            {address &&  <p className='text-center text-sm text-rose-400'> you're logged in with wallet {address.substring(0,5)}...{address.substring(address.length -5)}</p>}
            {/* Content*/}
            <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
                <img 
                    className='w-80 rounded-xl bg-gradient-to-br from-yellow-800 to-rose-600 p-1 lg:h-40' src={urlFor(collection.mainImage).url()}
                    alt="" 
                />
                <h1 className="text-3xl py-3 font-bold lg:text-5xl lg:font-extrabold"> {collection.title}
                </h1>
                {loading ? (
                    <p className="animate-pulse pt-2 text-xl text-green-500"> Loading Supply Count ...</p>
                ): (
                  <p className="pt-2 text-xl text-green-500"> {claimedSupply} / {totalSupply?.toString()} NFT's claimed
                    </p>
 
                )}
            
            
            </div>

            {/* Mint button*/}
            <button className='h-16 w-full rounded-full bg-violet-800 text-white font-bold'>
                Mint NFT (0.01 ETH)
            </button>
        </div>
    </div>
    
  )  
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const query = `*[_type == 'collection' && slug.current == $id][0]{
        _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage {
          asset
        },
        previewImage {
          asset
        },
        slug {
          current
        },
        creator-> {
          _id,
          name,
          address,
          slug {
            current
         },
        },
    }`

    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })

    if (!collection) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            collection
        }
    }
}

