import Link from 'next/link';
import React from 'react'

const GroupList = (props: {
  groups:  {id: number, name: string, description: string}[]
}) => {

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {props.groups.map(group => (
        <Link href={`/groups/${group.id}`} key={group.id} >
            <div className={`${group.id == 0 ? 'hidden' : ''} rounded shadow-lg bg2 fg m-2 px-4 py-2`}>
            <h2 className="text-xl">{group.name}</h2>
            <hr className='fg2' />
            <p className="text-md">{group.description}</p>
            </div>
        </Link>
      ))}
    </div>
  );
}

export default GroupList
