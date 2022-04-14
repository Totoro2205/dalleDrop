import React, { useEffect, useState} from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typing';
import { BigNumber} from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
interface Props {
    collection: Collection
}
function NFTDropPage({collection}: Props) {
    const [claimedSupply, setClaimedSupply] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<BigNumber>()
    const nftDrop = useNFTDrop(collection.address)
    const [loading, setLoading] = useState(true)
    const [priceInEth, setPriceInEth] = useState<string>()

    // Auth
    const connectWithMetamask = useMetamask()
    const address = useAddress()
    const disconnect = useDisconnect()
    // ---
    useEffect(() => {
        if (!nftDrop) return

        const fetchPrice = async() => {
            const claimConditions = await nftDrop.claimConditions.getAll()
            setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
        }
        fetchPrice()
    }, [nftDrop])
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
    
    const mintNft = () => {
        if (!nftDrop || !address) return 
        
        const quantity = 1
        setLoading(true)
        const notification = toast.loading('Minting...', {
            style: {
                background: 'white',
                color: 'green',
                fontWeight: 'bolder',
                fontSize: '17px',
                padding: '20px',
            }
        })

        nftDrop.claimTo(address, quantity).then(async (tx) => {
            const receipt = tx[0].receipt
            const claimedTokenId = tx[0].id
            const claimNFT = await tx[0].data()

            toast('HOORAY.. Successfully Minted!', {
                duration: 8000,
                style: {
                    background: 'green',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px',
                }
            })

            console.log(receipt)
            console.log(claimedTokenId)
            console.log(claimNFT)

        }).catch(err => {
            console.log(err)
            toast('whoops...', {
                style: {
                    background: 'red',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px,'
                }
            })
        }).finally(() => {
            setLoading(false)
            toast.dismiss(notification)
        })
    }

  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10 '>
        <Toaster position='bottom-center' />
        <div className='bg-gradient-to-br from-blue-600 to-orange-600 lg:col-span-4'>
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
        <div className='flex flex-1 flex-col bg-gradient-to-br from-yellow-400 to-rose-900 p-12 lg:col-span-6'>
            {/* Header */}
            <header className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'> The{' '}
                    <span className='font-extrabold underline decoration-yellow-100/50'>Dalle
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
            {address &&  <p className='text-center text-sm text-green-900'> you're logged in with wallet {address.substring(0,5)}...{address.substring(address.length -5)}</p>}
            {/* Content*/}
            <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0'>
                <img 
                    className='w-80 rounded-xl bg-gradient-to-br from-yellow-800 to-rose-600 p-1 lg:h-40' src={urlFor(collection.mainImage).url()}
                    alt="" 
                />
                <h1 className="text-3xl py-3 font-bold lg:text-5xl lg:font-extrabold"> {collection.title}
                </h1>
                {loading ? (
                    <p className="animate-bounce pt-2 text-xl text-green-900"> Loading Supply Count ...</p>
                ): (
                  <p className="pt-2 text-xl text-green-900">{claimedSupply} / {totalSupply?.toString()} NFT's claimed
                  </p>
 
                )}

            </div>

            {/* Mint button*/}
            <button onClick={mintNft} disabled={loading || claimedSupply === totalSupply?.toNumber() || !address } className='mt-10 h-16 w-full rounded-full bg-violet-800 text-white disabled:bg-gray-400 font-bold'
            >
                {loading ? (
                    <>Loading</>
                ): claimedSupply === totalSupply?.toNumber() ? (
                    <>SOLD OUT</>

                ): !address ? (
                    <>Sign in to Mint</>
                ): (
                    <span className='font-bold'>Mint NFT ({priceInEth} ETH)</span>
                )}
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

