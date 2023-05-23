import connectToDB from '../db/dbconfig.js';


const queryAreas = () => {
    const pool = connectToDB();

    const queryString = "CREATE TABLE IF NOT EXISTS areas (id SERIAL PRIMARY KEY,name VARCHAR(255),geom geometry(Polygon, 4326));";

    pool.query(queryString, (err, res) => {
        if (err) {
            console.error('Erro ao executar a tabela:', err);
        }
        pool.end();
    });
};
queryAreas()
export default queryAreas;