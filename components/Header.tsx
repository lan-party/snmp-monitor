import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='w-full h-15 flex bg-dark text-lg items-center'>
      <Link href="/" className='hover:bg-dark-hover h-full pt-4 px-3'>
        Home
      </Link>
      <h1 className='grow text-center'>SNMP Monitor</h1>
    </div>
  )
}

export default Header
