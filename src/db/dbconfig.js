import pg from "pg";
const { Pool } = pg;

const connectToDB = () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postggis',
    password: 'admin',
    port: 5432, 
  });

  return pool;
};


export default connectToDB;
