const express = require('express');
const pool = require('../controllers/db.js');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authorization.js');

const router = express.Router();

//definicion del esquema user que contiene los datos de un usuario en swagger

/**
 * @swagger
 * components:
 *   schemas:
 *          users:
 *              type: object
 *              properties: 
 *                  email:
 *                      type: string
 *                      description: Correo del Usuario
 *                      example: 'esteban@gmail.com'
 *                  password:
 *                      type: string
 *                      description: Contraseña del Usuario
 *                      example: 'esteban1234'
 */

//creacion del metodo get para mostrar los usuarios

/**
 * @swagger
 * /grupo-b/users:
 *  get:
 *   security:
 *     - bearerAuth: []
 *   summary: muestra los usuarios encriptados
 *   tags: [users]
 *   description: Funcion que muestra los usuarios con la clave encriptada y id aleatorio 
 *   responses:
 *    200:
 *     description: Usuario creado exitosamente
 *    500:
 *     description: Error interno del servidor
 *   
 */

router.get('/', authenticateToken, async(req, res) => { //funcion que muestra los usuarios ingresados en la base de datos
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({ users: users.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//creacion del metodo post para crear un usuario en swagger

/**
 * @swagger
 * /grupo-b/users/register:
 *  post:
 *   summary: Crea un usuario
 *   tags: [users]
 *   description: Se crea un usuario en la base de datos respectiva, para poder realizar las operaciones
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/users'
 *   responses:
 *    200:
 *     description: Usuario creado exitosamente
 *    500:
 *     description: Error interno del servidor
 *   
 */

router.post('/register', async(req, res) => { //funcion en donde se regrista el usuario con un email y contraseña
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (user_email,user_password) VALUES ($1,$2) RETURNING *', [req.body.email, hashedPassword]);
        res.json({ users: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;