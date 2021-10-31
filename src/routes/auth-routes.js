const express = require('express');
const { json } = require('express');
const pool = require('../controllers/db.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtTokens } = require('../utils/jwt-helpers.js');

const router = express.Router();


//definicion del esquema auth para la realizacion del metodo post en swagger
/**
 * @swagger
 * components:
 *   schemas:
 *          auth:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      description: Correo del usuario
 *                      example: 'esteban@gmail.com'
 *                  password:
 *                      type: string
 *                      description: Contraseña del usuario
 *                      example: 'esteban1234'
 */




//creacion del metodo post para el inicio de sesion  en el swagger
/**
 * @swagger
 * /grupo-b/auth/login:
 *  post:
 *   summary: Inicio de sesion
 *   tags: [auth]
 *   description: Inicia la sesion de un usuario con sus datoas asociados, mas la otorgacion del token para poder utilizar la otras funcionalidades del API
 *   requestBody:
 *    content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/auth'
 *   responses:
 *    200:
 *      description: Sesion iniciada, se muestra el usuario y su token de sesion
 *    401:
 *      description: Correo y/o contraseña incorrecta (Autorizacion denegada)
 *    404:
 *      description: El usuario no existe
 *    500:
 *     description: Error interno del servidor
 */

router.post('/login', async(req, res) => { //Funcion de acceso con usuario previamente registrado
    try {
        const { email, password } = req.body;
        const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (users.rows.length === 0) return res.status(401).json({ error: "Email incorrecto" });
        //comprobacion de contraseña
        const validPassword = await bcrypt.compare(password, users.rows[0].user_password); //lugar donde se compara la password ingresa con la codificada en la base de datos
        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });
        //JWT
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        res.json(tokens);

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


//creacion del metodo get para obtener el refresh token
/**
 * @swagger
 * /grupo-b/auth/refresh_token:
 *  get:
 *   summary: refresca el token del usuario
 *   tags: [auth]
 *   description: entrega el token al usuario para poder acceder a las demas consultas en el API
 *   responses:
 *    200:
 *      description: Entrega el token al usuario 
 *    401:
 *      description: Error de autorizacion
 *    404:
 *      description: No se pudo comprobar el usuario existente
 *    500:
 *     description: Error interno del servidor
 */


router.get('/refresh_token', (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken === null) return res.status(401).json({ error: 'refresh token nulo' });// if que muestra un token nulo de no haber iniciado sesion
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) return res.status(403).json({ error: error.message });
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
            res.json(tokens);
        })
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})


//creacion del metodo delete para eliminar el token
/**
 * @swagger
 * /grupo-b/auth/refresh_token:
 *  delete:
 *   summary: elimina el token
 *   tags: [auth]
 *   description: Elimina el token de acceso al usuario que lo solicita
 *   responses:
 *    200:
 *      description: elimina el token al usuario 
 *    401:
 *      description: Error de autorizacion
 *    404:
 *      description: No se encontro el token
 *    500:
 *     description: Error interno del servidor
 */

router.delete('/refresh_token', (req, res) => { //funcion delete para eliminar el refresh token
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: 'refresh token eliminado' })
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})

module.exports = router;