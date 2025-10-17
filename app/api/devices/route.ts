import getConnection from "@/services/db";

export async function GET(request: Request) {

  const conn = await getConnection();

  let [results, fields] = await conn.query('SELECT * FROM `devices`');
  
  const url = await request.url;
  if (url.includes("?") && url.includes("=")){
    
    const groupId = url.split("?")[1].split("=")[1];
    [results, fields] = await conn.query('SELECT * FROM `devices` WHERE `group_id` = ?', [groupId]);
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
 
export async function POST(request: Request) {

  const conn = await getConnection();

  const {group_id, name, ip, unit, oid, backup_oid} = await request.json();
 
  const [result, fields] = await conn.execute(
    'INSERT INTO `devices` (`group_id`, `name`, `ip`, `unit`, `oid`, `backup_oid`) VALUES (?, ?, ?, ?, ?, ?)', 
    [group_id, name, ip, unit, oid, backup_oid]);

  return new Response(JSON.stringify("insertId" in result ? result.insertId : 0), {
    status: ("insertId" in result && result.insertId) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE(request: Request) {

  const conn = await getConnection();

  let result = {};

  const url = await request.url;
  if (url.includes("?") && url.includes("=")){
    
    const groupId = url.split("?")[1].split("=")[1];
    [result] = await conn.query('DELETE FROM `devices` WHERE `group_id` = ?', [groupId]);
  }
  
  return new Response(JSON.stringify(result), {
    status: ("affectedRows" in result && result.affectedRows) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}