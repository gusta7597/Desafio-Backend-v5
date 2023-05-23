import pg from "pg";
const { Pool } = pg;

const connectToDB = () => {
  const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432, 
  });

  return pool;
};


export default connectToDB;
