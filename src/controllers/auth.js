import connectToDB from '../db/dbconfig.js';
import jwt from 'jsonwebtoken';
const chaveSecreta = '9H3X7R6K';

export async function auth(req, res) {
    const pool = connectToDB()
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        const query = {
            text: 'SELECT * FROM users WHERE email=$1 AND senha=$2',
            values: [email, senha]
        }
        const result = await pool.query(query);
        if (result.rows.length == 1) {
            return res.status(401).json({ error: 'Entrada não Autorizada.' });
        } else {
            const payload = { userId: 1 };
            const options = { expiresIn: '1h' };
            const token = jwt.sign(payload, chaveSecreta, options);
            res.json({ auth: true, token });
        }
    }
    catch (error) {
        console.error('Erro ao verificar usuario:', error);
        res.status(500).json({ error: 'Erro ao verificar usuario' });
    }
    pool.end();



};

export function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }
    jwt.verify(token, chaveSecreta, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token de autenticação inválido.' });
        }
        req.usuarioId = decoded.userId;
        next();
    });
}