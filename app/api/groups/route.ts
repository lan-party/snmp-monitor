import getConnection from "@/services/db";

export async function GET(request: Request) {

  const conn = await getConnection();

  const [results, fields] = await conn.query('SELECT * FROM `groups`');


  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
 
export async function POST(request: Request) {

  const conn = await getConnection();

  const {name, description} = await request.json();
 
  const [result, fields] = await conn.execute('INSERT INTO `groups` (`name`, `description`) VALUES (?, ?)', [name, description]);

  return new Response(JSON.stringify("insertId" in result ? result.insertId : 0), {
    status: ("insertId" in result && result.insertId) ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
}