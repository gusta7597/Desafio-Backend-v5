import connectToDB from '../db/dbconfig.js';

export async function allLocations(req, res) {
    const pool = connectToDB()
    try {
        const query = 'SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM locations';
        const result = await pool.query(query);

        const features = result.rows.map(row => ({
            type: 'Feature',
            geometry: row.geometry,
            properties: {
                id: row.id,
                name: row.name
            }
        }));

        const geoJson = {
            type: 'FeatureCollection',
            features
        };
        res.json(geoJson);
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        res.status(500).json({ error: 'Erro ao obter os dados do banco de dados' });
    }
    pool.end()
}

export async function specificLocation(req, res) {
    const pool = connectToDB()
    try {
        let id = req.params.id;
        const query = {
            text: 'SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM locations WHERE id=$1',
            values: [id]
        }
        const result = await pool.query(query);

        const features = result.rows.map(row => ({
            type: 'Feature',
            geometry: row.geometry,
            properties: {
                id: row.id,
                name: row.name
            }
        }));
        const geoJson = {
            type: 'FeatureCollection',
            features
        };
        res.json(geoJson);
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        res.status(500).json({ error: 'Erro ao obter os dados do banco de dados' });
    }
    pool.end()
}

export async function createLocation(req, res) {
    const pool = connectToDB()
    try {
        const { name, longitude, latitude } = req.body;
        if (!latitude || !longitude || !name) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const query = {
            text: 'INSERT INTO locations (name, geom) VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))',
            values: [name, longitude, latitude]
        }
        const result = await pool.query(query);
        res.status(200).json({ message: 'Criado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao inserir dados:', error);
        res.status(500).json({ error: 'Erro ao inserir dados no banco de dados' });
    }
    pool.end();
}
export async function updateLocation(req, res) {
    const pool = connectToDB();
    try {
        let id = req.params.id
        const { name, longitude, latitude } = req.body;
        if (!latitude || !longitude || !name) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const query = {
            text: 'UPDATE locations SET name = $1, geom =ST_SetSRID(ST_MakePoint($2, $3), 4326)  WHERE id = $4;',
            values: [name, longitude, latitude, id],
        };
        const result = await pool.query(query);
        res.status(200).json({ message: 'Editado com sucesso' });
    } catch (error) {
        console.error('Erro ao editar local:', error);
        res.status(500).json({ message: 'Erro ao editar local' });
    }
    pool.end();
}
export async function deleteLocation(req, res) {
    const pool = connectToDB();
    try {
        let id = req.params.id
        const query = {
            text: 'DELETE FROM locations WHERE id = $1;',
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
}

export async function distanceTo(req, res) {
    const pool = connectToDB();
    try {
        const ponto1Id = req.params.id1;
        const ponto2Id = req.params.id2;
        if (!ponto1Id || !ponto2Id) {
            return res.status(400).json({ error: 'IDs dos pontos inválidos.' });
        }

        const result = await pool.query(`SELECT ST_Distance(ponto1.geom, ponto2.geom) as distancia FROM locations AS ponto1, locations AS ponto2 WHERE ponto1.id = $1 AND ponto2.id = $2;`
            , [ponto1Id, ponto2Id]);

        if (result.rows.length !== 1) {
            return res.status(404).json({ error: 'Pontos não encontrados.' });
        }

        const distancia = result.rows[0].distancia;

        res.json({ distancia });

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).json({ error: 'Erro ao calcular a distância.' });
    }
    pool.end();
};

export async function isInArea(req, res) {
    const pool = connectToDB();
    try {
        const pontoId = req.params.id1;
        const areaId = req.params.id2;

        if (!pontoId || !areaId) {
            return res.status(400).json({ error: 'IDs do ponto e da área inválidos.' });
        }

        const result = await pool.query(`SELECT ST_Contains(area.geom, ponto.geom) as esta_dentro FROM areas AS area, locations AS ponto WHERE area.id = $1 AND ponto.id = $2; `,
            [areaId, pontoId]);

        if (result.rows.length !== 1) {
            return res.status(404).json({ error: 'Ponto ou área não encontrados.' });
        }

        const estaDentro = result.rows[0].esta_dentro;

        res.json({ estaDentro });

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).json({ error: 'Erro ao verificar se o ponto está dentro da área.' });
    }
    pool.end();
};


export async function allInArea(req, res) {
    const pool = connectToDB();
    try {
        const areaId = req.params.id;
        if (!areaId) {
            return res.status(400).json({ error: 'ID da área inválido.' });
        }
        const result = await pool.query(`SELECT EXISTS ( SELECT 1 FROM locations AS ponto WHERE ST_Contains((SELECT geom FROM areas WHERE id = $1), ponto.geom)) AS todos_dentro;
      `, [areaId]);
        if (result.rows.length !== 1) {
            return res.status(404).json({ error: 'Área não encontrada.' });
        }
        const todosDentro = result.rows[0].todos_dentro;

        res.json({ todosDentro });

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).json({ error: 'Erro ao verificar se todos os pontos estão dentro da área.' });
    }
    pool.end();
};