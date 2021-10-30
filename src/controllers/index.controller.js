const { Pool } = require('pg');
const cheerio = require('cheerio');
const request = require('request-promise');

/* const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'diego1234',
    database: 'clima',
    port: '5432'
});
 */
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'esteban151097',
    database: 'clima',
    port: '5432'
});

const getStations = async(req, res) => { // funcion utilizada para desplegar las estaciones existentes en la base de datos
    const respuesta = await pool.query('SELECT * FROM estaciones'); // realiza la consulta sobre las estaciones
    res.status(200).json(respuesta.rows); // muestra los datos almacenados en la base de datos
};

const getStationsByID = async(req, res) => { // funcion utilizada para obtener el codigo ingresado por el usuario
    const id = req.params.id; // variable que guarda el codigo ingresado por el usuario
    const respuesta = await pool.query('SELECT * FROM estaciones WHERE codigo = $1', [id]); // realiza la consulta mediate el codigo ingresado
    res.status(200).json(respuesta.rows); // muestra el resultado encontrado

};



const searchWithParameters = async(req, res) => { // funcion para obtener los parametros de la consulta POST
    const { parameter, fechaInicial, fechaFinal } = req.body;

    if (parameter == 'precipitaciones') {
        const respuesta = await pool.query('SELECT precipitaciones as agua_caida, idperiodo as Fecha FROM indicadores WHERE idperiodo BETWEEN ($1) AND ($2);', [fechaInicial, fechaFinal]);
        res.status(200).json(respuesta.rows); // retorna la consulta con el rango de fechas solicitado
    } else {
        if (parameter == 'temp_max') {
            const respuesta = await pool.query('SELECT temp_max as temperatura_maxima, idperiodo as Fecha FROM indicadores WHERE idperiodo BETWEEN ($1) AND ($2);', [fechaInicial, fechaFinal]);
            res.status(200).json(respuesta.rows);
        } else {
            if (parameter == 'temp_min') {
                const respuesta = await pool.query('SELECT temp_min as temperatura_minima, idperiodo as Fecha FROM indicadores WHERE idperiodo BETWEEN ($1) AND ($2);', [fechaInicial, fechaFinal]);
                res.status(200).json(respuesta.rows);
            } else {
                res.status(404).send("parametro invalido");
            }

        }

    }

};


const getEstimate = async(req, res) => { // funcion utilizada para realizar una estimacion
    const parameter = req.params.parametro;
    const lat = req.params.latitud;
    const lon = req.params.longitud;
    if (parameter == "precipitaciones") {
        const resultado = await pool.query("SELECT avg(precipitaciones) as agua_caida_estimada FROM indicadores JOIN estaciones on indicadores.codigo_esta = estaciones.codigo WHERE  estaciones.latitud = $1 AND estaciones.longitud = $2;", [lat, lon]);
        res.status(200).json(resultado.rows);

    } else {
        if (parameter == "temp_max") {
            const resultado = await pool.query("SELECT avg(temp_max) as temperatura_maxima_estimada FROM indicadores JOIN estaciones on indicadores.codigo_esta = estaciones.codigo WHERE  estaciones.latitud = $1 AND estaciones.longitud = $2;", [lat, lon]);
            res.status(200).json(resultado.rows);

        } else {
            if (parameter == "temp_min") {
                const resultado = await pool.query("SELECT avg(temp_min) as temperatura_minima_estimada FROM indicadores JOIN estaciones on indicadores.codigo_esta = estaciones.codigo WHERE  estaciones.latitud = $1 AND estaciones.longitud = $2;", [lat, lon]);
                res.status(200).json(resultado.rows);

            } else {
                res.status(404).send('parametro no encontrado');
            }
        }
    }
};

module.exports = {
    getStations,
    getStationsByID,
    searchWithParameters,
    getEstimate
}