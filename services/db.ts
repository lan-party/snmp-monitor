import mysql from  'mysql2/promise';

async function getConnection(){
  if(process.env.NODE_ENV  === 'development'){
    return await mysql.createConnection({
      host: process.env.DEV_MYSQL_HOST,
      user: process.env.DEV_MYSQL_USERNAME,
      password: process.env.DEV_MYSQL_PASSWORD,
      database: process.env.DEV_MYSQL_DATABASE,
    });
  }else{
    return await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }
}

export default getConnection;