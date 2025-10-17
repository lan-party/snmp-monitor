'use client';
import DeviceList from '@/components/DeviceList';
import Modal from '@/components/Modal';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = ({
  params,
}: {
  params: Promise<{ id: number }>
}) => {
    const router = useRouter();

    const [group, setGroup] = useState({id: 0, name: '', description: ''});
    const [devices, setDevices] = useState([{id: 0, group_id: 0, name: '', ip: '', unit: '', oid: '', backup_oid: ''}]);
    const [openForm, setOpenForm] = useState(false);
    const [openNewDeviceForm, setOpenNewDeviceForm] = useState(false);
    const [openDeleteForm, setOpenDeleteForm] = useState(false);
    const [newDevice, setNewDevice] = useState({group_id: group.id, name: '', ip: '', unit: '', oid: '', backup_oid: ''});
    const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    (async () => {
      const { id } = await params;

      if(hasCookie(`group${id}`))
        setGroup(JSON.parse(getCookie(`group${id}`) as string));

      if(hasCookie(`groupDevices${id}`))
        setGroup(JSON.parse(getCookie(`groupDevices${id}`) as string));

      try{
          
          // Get group data
          const data = await (
            await fetch(
              `/api/groups/${id}`, 
              {method: 'GET', headers: {'Content-Type': 'application/json'}}
            )
          ).json();

          setGroup(data[0]);

          setCookie(`group${id}`, data[0]);

      }catch(err){
          console.log(err);
      }
      
      try{
          const { id } = await params;

          // Get device list data
          const data = await (
            await fetch(
              `/api/devices?groupId=${id}`, 
              {method: 'GET', headers: {'Content-Type': 'application/json'}}
            )
          ).json();

          setDevices(data);

          setCookie(`groupDevices${id}`, data);

      }catch(err){
          console.log(err);
      }
        
    })();
  }, [refresh]);

  async function createDevice(){
    try{
      const { id } = await params;

      // Add device to group
      const data = await (
        await fetch(
          `/api/devices`, 
          {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              group_id: id, 
              name: newDevice.name, 
              ip: newDevice.ip, 
              unit: newDevice.unit, 
              oid: newDevice.oid, 
              backup_oid: newDevice.backup_oid
            })
          }
        )
      ).json();

      setOpenNewDeviceForm(false);
      setDevices([...devices, {
              id: data, 
              group_id: id, 
              name: newDevice.name, 
              ip: newDevice.ip, 
              unit: newDevice.unit, 
              oid: newDevice.oid, 
              backup_oid: newDevice.backup_oid}]);

      setCookie(`groupDevices${id}`, devices);

    }catch(err){
      console.log(err);
    }
  }

  async function saveGroup(){
    try{
      const { id } = await params;

      // Get device data
      const data = await (
        await fetch(
          `/api/groups/${id}`, 
          {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              name: group.name, 
              description: group.description
            })
          }
        )
      ).json();

      setOpenForm(false);

    }catch(err){
        console.log(err);
    }
  }

  async function deleteGroup(){

    const { id } = await params;

    try{
        
      // Delete associated devices
      await (
        await fetch(
          `/api/devices?groupId=${id}`, 
          {method: 'DELETE', headers: {'Content-Type': 'application/json'}}
        )
      );

      deleteCookie(`groupDevices${id}`);


      try{
      
        // Delete group
        await (
          await fetch(
            `/api/groups/${id}`, 
            {method: 'DELETE', headers: {'Content-Type': 'application/json'}}
          )
        );

        deleteCookie(`group${id}`);

        router.push("/");

      }catch(err){
        console.log(err);
      }

    }catch(err){
        console.log(err);
    }
    
  }

  return (
    <div>
      
      <div className='flex'>
        <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 text-center mt-5 mb-3 flex-grow'>
          <p>Group ID: <i>{group.id}</i></p>
          <p>Name: <i>{group.name}</i></p>
          <p>Description: <i>{group.description}</i></p>
        </div>
        <div className='content-center pr-3'>
          <button className='btn-red ' onClick={() => {setOpenDeleteForm(true);}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <Modal open={openForm} setOpen={setOpenForm} title={`Updating group: '${group.name}'`} >
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          <div>
            <label htmlFor='name' className='input-label'>Name</label>
            <input id='name' className='input' type='text' placeholder='Name' value={group.name} onChange={(e) => { setGroup({...group, name: e.target.value}); setCookie(`group${group.id}`, group);}} />
          </div>
          <div>
            <label htmlFor='description' className='input-label'>Description</label>
            <textarea id='description' className='input' placeholder='Description' value={group.description} onChange={(e) => { setGroup({...group, description: e.target.value}); setCookie(`group${group.id}`, group);}} ></textarea>
          </div>

          <div>
            <button className='btn' onClick={saveGroup}>Save</button>
          </div>
        </div>
      </Modal>

      <Modal open={openDeleteForm} setOpen={setOpenDeleteForm} title={`Delete group: '${group.name}'`}>
        <div className='flex'>
          <div className='flex-grow'>
            Are you sure you want to delete this group?
          </div>

          <div>
            <button className='btn-red' onClick={deleteGroup}>Delete</button>
          </div>
        </div>
      </Modal>

      <button className='btn m-3' onClick={() => {setOpenForm(true)}} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      </button>

      <hr />

      <h1 className="text-3xl text-center m-3">Devices
      <button className='btn ml-3' onClick={() => {setOpenNewDeviceForm(true)}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      </h1>
      <DeviceList devices={devices} />

      <Modal open={openNewDeviceForm} setOpen={setOpenNewDeviceForm} title={`Create new device in group '${group.name}'`} >
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          <div>
            <label htmlFor='name' className='input-label'>Name</label>
            <input id='name' className='input' type='text' placeholder='Name' value={newDevice.name} onChange={(e) => { setNewDevice({...newDevice, name: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='ip' className='input-label'>IP Address</label>
            <input id='ip' className='input' type='text' placeholder='000.000.000.000' value={newDevice.ip} onChange={(e) => { setNewDevice({...newDevice, ip: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='unit' className='input-label'>Unit String</label>
            <input id='unit' className='input' type='text' placeholder='&#8451;' value={newDevice.unit} onChange={(e) => { setNewDevice({...newDevice, unit: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='oid' className='input-label'>OID</label>
            <input id='oid' className='input' type='text' placeholder='0.0.0.0.0.0.0.0.0' value={newDevice.oid} onChange={(e) => { setNewDevice({...newDevice, oid: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='backup-oid' className='input-label'>Backup OID</label>
            <input id='backup-oid' className='input' type='text' placeholder='1.1.1.1.1.1.1.1.1' value={newDevice.backup_oid} onChange={(e) => { setNewDevice({...newDevice, backup_oid: e.target.value})}} />
          </div>

          <div>
            <button className='btn mt-6 ml-1' onClick={createDevice}>Create</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Page
