import Link from 'next/link'
import React from 'react'

const DeviceList = (props: {
  devices:  {id: number, group_id: number, name: string, ip: string, unit: string, oid: string, backup_oid: string}[]
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {props.devices.map(device => (
        <Link href={`/devices/${device.id}`} key={device.id} >
            <div className={`${device.id == 0 ? 'hidden' : ''} rounded shadow-lg bg2 fg m-2 px-4 py-2`}>
            <h2 className="text-xl">{device.name}</h2>
            <hr className='fg2' />
            <p className="text-md">{device.ip}</p>
            </div>
        </Link>
      ))}
    </div>
  )
}

export default DeviceList
