import connectToDB from '../db/dbconfig.js';
import  jwt  from 'jsonwebtoken';

export async function auth(req, res) {
    // Se as credenciais estiverem corretas, gerar um token JWT
    const payload = { userId: 123 }; // Exemplo de payload com ID do usuário
    const chaveSecreta = 'sua-chave-secreta'; // Defina sua chave secreta
    const options = { expiresIn: '1h' }; // Defina um tempo de expiração

    const token = jwt.sign(payload, chaveSecreta, options);

    // Enviar o token no corpo da resposta
    res.json({ token });
};

export function autenticarJWT(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token, chaveSecreta, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token de autenticação inválido.' });
        }

        // Se o token for válido, decodificar as informações e passar para a próxima rota
        req.usuarioId = decoded.userId;
        next();
    });
}