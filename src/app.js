import express from "express";
import dbconfig from "./db/dbconfig.js";
import queryDatabase from "./model/locations.js";
import queryDatabaseUsers from "./model/users.js";
import connectToDB from '../src/db/dbconfig.js';
import queryAreas from "./model/areas.js";

const app = express();

app.use(express.json());



app.get('/', (req, res) => {
    res.status(200).send('Desafio BackEnd');
})

app.get('/locations', async (req, res) => {
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
});

app.get('/locations/:id', async (req, res) => {
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
});

app.post('/locations', async (req, res) => {
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
});

app.put('/locations/:id', async (req, res) => {
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
});

app.delete('/locations/:id', async (req, res) => {
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
});

app.get('/areas', async (req, res) => {
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
});

app.get('/areas/:id', async (req, res) => {
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
});



app.post('/areas', async (req, res) => {
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
});

app.put('/areas/:id', async (req, res) => {
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
        console.error('Erro ao editar local:', error);
        res.status(500).json({ message: 'Erro ao editar local' });
    }
    pool.end();
});





app.get('/v4/places/:id1/distanceto/:id2', async (req, res) => {
    try {
        let id = req.params.id
        const pool = connectToDB();
        const query = {
            text: 'DELETE FROM areas WHERE id = $1;',
            values: [id],
        };
        const long2 = {
            text: 'select longitude from places WHERE id = $1;',
            values: [id2],
        };
        const lat1 = {
            text: 'select latitude from places WHERE id = $1;',
            values: [id],
        };
        const lat2 = {
            text: 'select latitude from places WHERE id = $1;',
            values: [id2],
        };

        const lg1 = await pool.query(long1);
        const lg2 = await pool.query(long2);
        const lt1 = await pool.query(lat1);
        const lt2 = await pool.query(lat2);

        let l1 = lg1.rows[0].longitude;
        let longitude1 = parseFloat(l1)
        let l2 = lg2.rows[0].longitude;
        let longitude2 = parseFloat(l2)
        let l3 = lt1.rows[0].latitude;
        let latitude1 = parseFloat(l3)
        let l4 = lt2.rows[0].latitude;
        let latitude2 = parseFloat(l4)

        let distance = Math.sqrt((longitude1 - longitude2)**2 + (latitude1-latitude2)**2)

        res.status(200).json({ message: distance });
        pool.end();
    } catch (error) {
        console.error('Erro ao remover local:', error);
        res.status(500).json({ message: 'Erro ao remover local' });
    }
    pool.end();
});





export default app;