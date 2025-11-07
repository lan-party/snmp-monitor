import getConnection from "@/services/db";

export async function GET(request: Request) {

  const conn = await getConnection();

  const [results, fields] = await conn.query('SELECT * FROM `log`');


  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
 
export async function POST(request: Request) {

  const conn = await getConnection();

  const {device_id, value} = await request.json();
 
  const [result, fields] = await conn.execute(
    'INSERT INTO `log` (`device_id`, `value`) VALUES (?, ?)', 
    [device_id, value]);

  return new Response(JSON.stringify("insertId" in result ? result.insertId : 0), {
    status: ("insertId" in result && result.insertId) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}