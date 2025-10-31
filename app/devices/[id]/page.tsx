'use client';
import LoadingWheel from '@/components/LoadingWheel';
import Modal from '@/components/Modal';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
const Plot = dynamic(() => import('react-plotly.js'), {
      ssr: false, // This ensures the component is only loaded on the client-side
    });

const Page = ({
  params,
}: {
  params: Promise<{ id: number }>
}) => {
  const router = useRouter();

  const [device, setDevice] = useState({id: 0, group_id: 0, name: '', ip: '', unit: '', oid: '', backup_oid: ''});
  const [groups, setGroups] = useState([{id: 0, name: '', description: ''}]);

  const [openForm, setOpenForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const [plotData, setPlotData] = useState({x: [new Date()], y: ['']});
  

  useEffect(() => {
    (async () => {

      const { id } = await params;
      
      if(hasCookie(`device${id}`))
        setDevice(JSON.parse(getCookie(`device${id}`) as string));
      
      if(hasCookie('groups'))
        setGroups(JSON.parse(getCookie('groups') as string));


      try{
        
        // Get device data
        const data = await (
          await fetch(
            `/api/devices/${id}`, 
            {method: 'GET', headers: {'Content-Type': 'application/json'}}
          )
        ).json();

        setDevice(data[0]);

        setCookie(`device${id}`, data[0]);

      }catch(err){
          console.log(err);
      }

      try{

          // Get log data
          const data: [{device_id: number, ts: Date, value: string}] = await (
            await fetch(
              `/api/log/${id}`, 
              {method: 'GET', headers: {'Content-Type': 'application/json'}}
            )
          ).json();

          const plotDataTmp: {x: Date[], y: string[]} = {x: [], y: []};
          for(const row of data){
            plotDataTmp.x.push(row.ts);
            plotDataTmp.y.push(row.value);
          }
          console.log(plotDataTmp);

          setPlotData(plotDataTmp);

      }catch(err){
          console.log(err);
      }

      try{

          // Get groups data
          const data = await (
            await fetch(
              `/api/groups`, 
              {method: 'GET', headers: {'Content-Type': 'application/json'}}
            )
          ).json();

          setGroups(data);

          setCookie('groups', data);

      }catch(err){
          console.log(err);
      }
        
    })();
  }, []);


  async function saveDevice(){
    try{
      const { id } = await params;

      // Get device data
      const data = await (
        await fetch(
          `/api/devices/${id}`, 
          {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              group_id: device.group_id, 
              name: device.name, 
              ip: device.ip, 
              unit: device.unit, 
              oid: device.oid, 
              backup_oid: device.backup_oid
            })
          }
        )
      ).json();

      setOpenForm(false);

    }catch(err){
        console.log(err);
    }
  }

  async function deleteDevice(){

    const { id } = await params;

    try{
          
      // Delete device
      await (
        await fetch(
          `/api/devices/${id}`, 
          {method: 'DELETE', headers: {'Content-Type': 'application/json'}}
        )
      );

      deleteCookie(`device${id}`);

      router.push(`/groups/${device.group_id}`);

    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      {device.id ? <>
        <div className='grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 text-center mt-5 mb-3'>
          <p className='mb-2 md:mb-0'>Device ID: <i>{device.id}</i></p>
          <p>Group ID: <i>{device.group_id}</i></p>
        </div>
        <hr />
      </> : <LoadingWheel size='40' />}
      <div className='flex'>
        {device.id ? <div className='flex-grow grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 text-center mt-3'>
          <p>Name: <i>{device.name}</i></p>
          <p>IP Address: <i>{device.ip}</i></p>
          <p>Unit String: <i>{device.unit}</i></p>
          <p>OID: <i>{device.oid}</i></p>
          <p>Backup OID: <i>{device.backup_oid}</i></p>
        </div> : <div className='flex-grow grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 text-center mt-3'></div>}
        <div className='content-center pr-3 float-right'>
          <button className='btn-red ' onClick={() => {setOpenDeleteForm(true);}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <Modal open={openDeleteForm} setOpen={setOpenDeleteForm} title={`Delete device: '${device.name}'`}>
        <div className='flex'>
          <div className='flex-grow'>
            Are you sure you want to delete this device?
          </div>

          <div>
            <button className='btn-red' onClick={deleteDevice}>Delete</button>
          </div>
        </div>
      </Modal>
      

      <button className='btn m-3 float-right' onClick={() => {setOpenForm(true)}} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      </button>

      <Modal open={openForm} setOpen={setOpenForm} title={`Updating device: '${device.name}'`} >
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          <div>
            <label htmlFor='name' className='input-label'>Name</label>
            <input id='name' className='input' type='text' placeholder='Name' value={device.name} onChange={(e) => { setDevice({...device, name: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='ip' className='input-label'>IP Address</label>
            <input id='ip' className='input' type='text' placeholder='000.000.000.000' value={device.ip} onChange={(e) => { setDevice({...device, ip: e.target.value})}} />
          </div>
          
          <div>
            <label htmlFor='group-id' className='input-label'>Device Group</label>
            <select id='group-id' className='input select' value={device.group_id} onChange={(e) => { setDevice({...device, group_id: Number((e.target as HTMLSelectElement).value) }) }}>
              {groups.map((group) => (
                <option key={group.id} value={group.id} >{group.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor='unit' className='input-label'>Unit String</label>
            <input id='unit' className='input' type='text' placeholder='&#8451;' value={device.unit} onChange={(e) => { setDevice({...device, unit: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='oid' className='input-label'>OID</label>
            <input id='oid' className='input' type='text' placeholder='0.0.0.0.0.0.0.0.0' value={device.oid} onChange={(e) => { setDevice({...device, oid: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='backup-oid' className='input-label'>Backup OID</label>
            <input id='backup-oid' className='input' type='text' placeholder='1.1.1.1.1.1.1.1.1' value={device.backup_oid} onChange={(e) => { setDevice({...device, backup_oid: e.target.value})}} />
          </div>

          <div>
            <button className='btn' onClick={saveDevice}>Save</button>
          </div>
        </div>
      </Modal>

      <div className='w-full content-center px-auto' >
        <Plot data={[

          {

            x: plotData.x,

            y: plotData.y,

            type: 'scatter',

            mode: 'lines+markers',

            marker: {color: 'red'},

          }

        ]}

        layout={ {width: screen.width, height: 400, title: {text: `${device.name} - ${device.ip} `}} } />
        
      </div>
    </>
  )
}

export default Page
