'use client';
import GroupList from "@/components/GroupList";
import Modal from "@/components/Modal";
import { group } from "console";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Home() {
  
  const [groups, setGroups] = useState([{id: 0, name: '', description: ''}]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const [newGroup, setNewGroup] = useState({name: '', description: ''});

  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {

      
      (async () => {
        
        // Load groups from cookie until api call completes
        if(hasCookie('groups'))
          setGroups(JSON.parse((await getCookie('groups') as string)));
        
        try{

            // Get groups list
            const data = await (
              await fetch(
                "/api/groups", 
                {method: 'GET', headers: {'Content-Type': 'application/json'}}
              )
            ).json();

            setGroups(data);

            setCookie('groups', data);

            setGroupsLoading(false);
            
        }catch(err){
          console.log(err);
        }
    })();
  }, []);

  async function createGroup(){
    try{

      // Create new group
      const data = await (
        await fetch(
          `/api/groups`, 
          {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
              name: newGroup.name, 
              description: newGroup.description
            })
          }
        )
      ).json();

      setOpenForm(false);
      setGroups([...groups, {
              id: data, 
              name: newGroup.name, 
              description: newGroup.description
            }]);

      setCookie(`groups`, groups);

    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
    <main className="p-5">

      <h1 className="text-3xl text-center m-3">Groups
        <button className='btn ml-3' onClick={() => {setOpenForm(true)}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      </h1>
      <GroupList groups={groups} loading={groupsLoading} />
    </main>
    <Modal open={openForm} setOpen={setOpenForm} >
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          <div>
            <label htmlFor='name' className='input-label'>Name</label>
            <input id='name' className='input' type='text' placeholder='Name' value={newGroup.name} onChange={(e) => { setNewGroup({...newGroup, name: e.target.value})}} />
          </div>
          <div>
            <label htmlFor='description' className='input-label'>Description</label>
            <input id='description' className='input' type='text' placeholder='000.000.000.000' value={newGroup.description} onChange={(e) => { setNewGroup({...newGroup, description: e.target.value})}} />
          </div>

          <div>
            <button className='btn mt-6 ml-1' onClick={createGroup}>Create</button>
          </div>
        </div>
    </Modal>
    </>
  );
}
