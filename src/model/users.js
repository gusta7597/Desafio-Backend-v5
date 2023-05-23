import connectToDB from '../db/dbconfig.js';


const queryDatabaseUsers = () => {
  const pool = connectToDB();

const queryString = "CREATE TABLE IF NOT EXISTS users  (email VARCHAR(255),senha VARCHAR(255));"

  pool.query(queryString, (err, res) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
    }
    pool.end();
  });
};


queryDatabaseUsers();

export default queryDatabaseUsers;