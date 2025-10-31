import Link from 'next/link'
import React from 'react'
import LoadingWheel from './LoadingWheel'

const DeviceList = (props: {
  devices:  {id: number, group_id: number, name: string, ip: string, unit: string, oid: string, backup_oid: string}[],
  loading: boolean
}) => {
  return (
    <>
      {!props.loading ? 
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {props.devices.map(device => (
          <Link href={`/devices/${device.id}`} key={device.id} >
              <div className={`${device.id == 0 ? 'hidden' : ''} rounded shadow-lg bg2-hover fg m-2 px-4 py-2`}>
              <h2 className="text-xl m2-">{device.name}</h2>
              <hr className='fg2' />
              <p className="text-md my-3">{device.ip}</p>
              </div>
          </Link>
        ))}
      </div> :
      <LoadingWheel size='40' />}
    </>
  )
}

export default DeviceList
