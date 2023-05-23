import connectToDB from '../db/dbconfig.js';


const queryDatabase = () => {
  const pool = connectToDB();

  const queryString = "CREATE TABLE IF NOT EXISTS locations (id SERIAL PRIMARY KEY,name VARCHAR(255),geom GEOMETRY(Point, 4326));"

  pool.query(queryString, (err, res) => {
    if (err) {
      console.error('Erro ao executar a tabela:', err);
    }
    pool.end();
  });
};

export default queryDatabase;