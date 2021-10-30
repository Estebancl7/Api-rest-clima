const { Router } = require("express");
const router = Router();
const { getStations, getStationsByID, searchWithParameters, getEstimate } = require('../controllers/index.controller');

const { authenticateToken } = require('../middleware/authorization.js');

//defincion de esquema reporte con todos los datos asociados a este en swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     clima:
 *        type: object
 *        properties:
 *            codigo:
 *                type: int
 *                description: contiene el codigo asociado a una estacion de climatologia en Chile
 *                example: '200003'
 *            nombre:
 *                type: string
 *                description: Nombre de la Estacion de Climatologia Asociada
 *                example: 'Chacalluta, Arica'
 *            latitud:
 *                type: double
 *                description: Latitud de la estacion
 *                example: 30.24
 *            longitud:
 *                type: double
 *                description: Longitud de la estacion
 *                example: 10.47
 *            altura:
 *                type: double
 *                description: Altura donde se encuentra la estacion
 *                example: 102
 *            Precipitacion:
 *                type: double
 *                description: Valor asociado a la precipitacion en el dia del registro
 *                example: 0.5
 *            Temp_max:
 *                type: double
 *                description: Valor asociado en a la temperatura maxima del dia del registro
 *                example: 32.4
 *            Temp_min:
 *                type: double
 *                description: Valor asociado en a la temperatura minima del dia del registro
 *                example: 15.2
 *            Fecha:
 *                type: double
 *                description: Valor asociado al dia donde se realizo el registro
 *                example: '20-09-2021'
 *     search:
 *        type: object
 *        properties:
 *            parameter:
 *                type: string
 *                description: Indicador donde puede ser temp_min, temp_max o precipitaciones
 *                example: 'temp_min'
 *            fechaInicial:
 *                type: string
 *                description: fecha desde donde se quiere realizar la busqueda
 *                example: '30-10-2021'
 *            fechaFinal:
 *                type: string
 *                description: fecha donde termina la busqueda
 *                example: '31-10-2021'
 */



//creacion del metodo get para mostrar todas las estaciones climatologicas asociadas a la base de datos
/**
 * @swagger
 * /grupo-b/stations:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Ver todas las estaciones almacenadas en la base de datos
 *    tags: [clima]
 *    description: Permite ver todas las estaciones almacenadas en la base de datos
 *    responses:
 *      200:
 *        description: Se muestran todos muestra todas las estaciones
 *      404:
 *        description: No se encontro informacion en la base de datos
 *      500:
 *        description: Error interno del servidor
 */
router.get('/grupo-b/stations', authenticateToken, getStations);



//creacion del metodo get para mostrar una estacion climatologica mediante su codigo de referencia almacendado en la base de datos
/**
 * @swagger
 * /grupo-b/{id}/stations:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Ver estacion mediante su codigo de referencia
 *    tags: [clima]
 *    description: Permite encontrar una estacion con sus respectivos datos mediante su codigo de referencia en la base de datos
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *         type: integer
 *         minimum: 1
 *        description: codigo de la estacion asociada
 *        example: 200003
 *    responses:
 *      200:
 *        description: Muestra la estacion con sus respectivos datos (nombre, codigo, altura, latitud y longitud)
 *      404:
 *        description: No se encontro la informacion en la base de datos
 *      500:
 *        description: Error interno del servidor
 */
router.get('/grupo-b/:id/stations', authenticateToken, getStationsByID);



//creacion del metodo post para buscar un par
/**
 * @swagger
 * /grupo-b/search:
 *  post:
 *   security:
 *     - bearerAuth: []
 *   summary: Realiza una busqueda por parametros para encontrar un indicador desde y hasta una fecha determinada
 *   tags: [clima]
 *   description: Realiza una busqueda por parametros para encontrar un indicador desde y hasta una fecha determinada retornando la coleccion de datos pertenecientes a ese rango
 *   requestBody: 
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/search'
 *   responses:
 *    200:
 *     description: Se encontraron datos en el rango deseado 
 *    404:
 *     description: No se encontraron datos
 *    500:
 *     description: Error interno del servidor
 */
router.post('/grupo-b/search', authenticateToken, searchWithParameters);


//creacion del metodo get para estimar un indicador en una fecha concreta
/**
 * @swagger
 * /grupo-b/{parameter}/-{latitud}/-{longitud}/estimate:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: muestra el parametro estimado de una estacion en la fecha actual
 *    tags: [clima]
 *    description: muestra los datos estimados para la fecha actual, obtenidos del boletin diario
 *    parameters:
 *      - in: path
 *        name: parameter
 *        required: true
 *        schema: 
 *         type: string
 *         minimum: 1
 *        description: indicador el cual puede ser precipitaciones, temp_min o temp_max
 *        example: temp_min
 *      - in: path
 *        name: latitud
 *        required: false
 *        schema:
 *         type: string
 *         minimum: 1
 *        description: la latitud de la estacion asociada con valor positivo
 *        example: 20.54917
 *      - in: path
 *        name: longitud
 *        required: false
 *        schema:
 *         type: string
 *         minimum: 1
 *        description: la longitud de la estacion asociada con valor positivo
 *        example: 70.18111	
 *    responses:
 *      200:
 *        description: Muestra la estimacion de los datos
 *      404:
 *        description: No se encontro la informacion en la base de datos
 *      500:
 *        description: Error interno del servidor
 */
router.get('/grupo-b/:parametro/:latitud/:longitud/estimate', authenticateToken, getEstimate);

module.exports = router;