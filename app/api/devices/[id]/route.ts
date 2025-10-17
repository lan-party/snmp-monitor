import getConnection from "@/services/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    const conn = await getConnection();

    const [result, fields] = await conn.query('SELECT * FROM `devices` WHERE `id` = ?', [id]);

    return new Response(JSON.stringify(result), {
    status: result ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
    });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }){
    const { id } = await params;

    const conn = await getConnection();

    const {group_id, name, ip, unit, oid, backup_oid} = await request.json();

    const [result, fields] = await conn.execute(
      'UPDATE `devices` SET `group_id` = ?, `name` = ?, `ip` = ?, `unit` = ?, `oid` = ?, `backup_oid` = ? WHERE `id` = ?', 
      [group_id, name, ip, unit, oid, backup_oid, id]);
    
    return new Response(JSON.stringify(result), {
      status: ("affectedRows" in result && result.affectedRows) ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }){
  const { id } = await params;

  const conn = await getConnection();

  const [result, fields] = await conn.execute('DELETE FROM `devices` WHERE `id` = ?', [id]);
  
  return new Response(JSON.stringify(result), {
    status: ("affectedRows" in result && result.affectedRows) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}