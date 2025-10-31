import React, { Dispatch } from 'react'

const Modal = (props: {children: React.ReactNode, open: boolean, setOpen:Dispatch<boolean>, title?: string}) => {
  return (
    <div className={`${props.open ? '' : 'hidden'}`}>

      <div className='w-full h-full absolute top-0 bg-gray-800 opacity-50 z-2' onClick={() => {props.setOpen(false)}}></div>

      <div className='absolute top-1/5 w-full'>
        <div className="flex h-1/2 justify-center items-center">
            <div className="bg fg p-2 rounded shadow-lg m-2 px-4 py-2 w-3/4 min-h-1/2 z-3">
                <div className='flex'>
                    <div className='content-center w-full grow'>
                        <h1 className='text-center text-2xl'>{props.title}</h1>
                    </div>
                    <div className='text-right mb-4 mt-1 flex-none'>
                        <button className='btn2' onClick={() => {props.setOpen(false)}} >X</button>
                    </div>
                </div>
                
                {props.children}
            </div>
        </div>
      </div>

    </div>
  )
}

export default Modal
