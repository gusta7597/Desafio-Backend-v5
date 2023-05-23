import connectToDB from '../db/dbconfig.js';

export async function allAreas (req, res){
    const pool = connectToDB()
    try {
        const query = 'SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM areas;';
        const result = await pool.query(query);
        const areas = result.rows
        res.json(areas);
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        res.status(500).json({ error: 'Erro ao obter os dados do banco de dados' });
    }
    pool.end();
};


export async function specificArea (req, res) {
    const pool = connectToDB()
    try {
        let id = req.params.id
        const query = {
            text: 'SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM areas WHERE id = $1;',
            values: [id]
        }
        const result = await pool.query(query);
        const areas = result.rows
        res.json(areas);
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        res.status(500).json({ error: 'Erro ao obter os dados do banco de dados' });
    }
    pool.end();
};
export async function createArea(req, res) {
    const pool = connectToDB()
    try {
        const { name, geometry } = req.body;
        if (!name || !geometry) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const query = {
            text: 'INSERT INTO areas (name, geom) VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326))',
            values: [name, geometry]
        }
        const result = await pool.query(query);
        res.status(200).json({ message: 'Criado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao inserir dados:', error);
        res.status(500).json({ error: 'Erro ao inserir dados no banco de dados' });
    }
    pool.end();
};

export async function updateArea (req, res){
    const pool = connectToDB();
    try {
        let id = req.params.id
        const { name, geometry } = req.body;
        if (!name || !geometry) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const query = {
            text: 'UPDATE areas SET name = $1, geom =ST_SetSRID(ST_GeomFromGeoJSON($2), 4326)  WHERE id = $3;',
            values: [name, geometry, id],
        };
        const result = await pool.query(query);
        res.status(200).json({ message: 'Editado com sucesso' });
        pool.end();
    } catch (error) {
        console.error('Erro ao editar local:', error);
        res.status(500).json({ message: 'Erro ao editar local' });
    }
    pool.end();
}
export async function deleteArea(req, res){
    const pool = connectToDB();
    try {
        let id = req.params.id
        const query = {
            text: 'DELETE FROM areas WHERE id = $1;',
            values: [id],
        };
        const result = await pool.query(query);
        res.status(200).json({ message: 'removido com sucesso' });
        pool.end();
    } catch (error) {
        console.error('Erro ao remover local:', error);
        res.status(500).json({ message: 'Erro ao remover local' });
    }
    pool.end();
};

