import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='w-full h-15 flex bg-gray-500 text-lg items-center '>
      <Link href="/" className='hover:bg-gray-700 h-full pt-4 px-3'>
        Home
      </Link>
    </div>
  )
}

export default Header
