import getConnection from "@/services/db";

export async function GET(request: Request, { params }: { params: Promise<{ device_id: string }> }) {
    const { device_id } = await params;

    const conn = await getConnection();

    const [result, fields] = await conn.query('SELECT * FROM `log` WHERE `device_id` = ?', [device_id]);

    return new Response(JSON.stringify(result), {
    status: result ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ device_id: string }> }){
  const { device_id } = await params;

  const conn = await getConnection();

  const [result, fields] = await conn.execute('DELETE FROM `log` WHERE `device_id` = ?', [device_id]);
  
  return new Response(JSON.stringify(result), {
    status: ("affectedRows" in result && result.affectedRows) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}