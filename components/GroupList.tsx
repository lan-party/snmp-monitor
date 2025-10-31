import Link from 'next/link';
import React from 'react'
import LoadingWheel from './LoadingWheel';

const GroupList = (props: {
  groups:  {id: number, name: string, description: string}[],
  loading: boolean
}) => {

  return (
    <>
    {!props.loading ?
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {props.groups.map(group => (
        <Link href={`/groups/${group.id}`} key={group.id} >
            <div className={`${group.id == 0 ? 'hidden' : ''} rounded shadow-lg bg2-hover fg m-2 px-4 py-2`}>
              <h2 className="text-xl m-2">{group.name}</h2>
              <hr className='fg2' />
              <p className="text-md my-3">{group.description}</p>
            </div>
        </Link>
      ))}
    </div> : <LoadingWheel size='40' />}
    </>
  );
}

export default GroupList
