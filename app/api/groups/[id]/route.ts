import getConnection from "@/services/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const conn = await getConnection();

    const [result, fields] = await conn.query('SELECT * FROM `groups` WHERE `id` = ?', [id]);

    return new Response(JSON.stringify(result), {
    status: result ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
    });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }){
    const { id } = await params;

    const conn = await getConnection();

    const {name, description} = await request.json();

    const [result, fields] = await conn.execute('UPDATE `groups` SET `name` = ?, `description` = ? WHERE `id` = ?', [name, description, id]);
    
    return new Response(JSON.stringify(result), {
      status: ("affectedRows" in result && result.affectedRows) ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }){
  const { id } = await params;

  const conn = await getConnection();

  const [result, fields] = await conn.execute('DELETE FROM `groups` WHERE `id` = ?', [id]);
  
  return new Response(JSON.stringify(result), {
    status: ("affectedRows" in result && result.affectedRows) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}