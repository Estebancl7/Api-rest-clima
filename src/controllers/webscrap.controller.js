const { Pool } = require('pg');
const cheerio = require('cheerio');
const request = require('request-promise');




const scrapingEstaciones = async(req, res) => { // funcion utilizada para obtener el numero total de estaciones de la pagina de climatologia
    const respuesta = await request('https://climatologia.meteochile.gob.cl/application/informacion/catastroEstaciones') // obtienen el conjunto de estaciones pertenecientes al registro de la pagina
    const wwe = cheerio.load(respuesta);
    const data = [];
    let count = 0;

    for (let i = 1; i <= 16; i++) { // se realiza un ciclo for para recorre las 16 regiones
        wwe("#n" + i + "> div.table-responsive-lg > table > tbody > tr").each((index, element) => { // se concatena #n + i para acceder a la tabla de la respectiva region 
            if (index === 0) return true;
            const tds = wwe(element).find("td");
            const codigo_na = wwe(tds[0]).text(); // obtiene el codigo de estacion
            let nombre = wwe(tds[1]).text(); // obtiene el nombre de la estacion
            const latitud = wwe(tds[3]).text(); // obtiene la latitud asociada a la estacion
            const longitud = wwe(tds[4]).text(); // obtiene la longitud asociada a la estacion
            const altura = wwe(tds[5]).text(); // obtiene la altura asociada a la estacion

            const table_row = {
                codigo_na,
                nombre,
                latitud,
                longitud,
                altura
            };
            count++; // contador para verificar la cantidad de registros
            data.push(table_row); // guarda los datos en un array
        });
    }

    await insertRegistros(data); // funcion para insertar las estaciones en la base de datos

}




const test = async(req, res) => {

    const fechaNueva = new Date;
    console.log("esta es la fecha de hoy:", fechaNueva.toLocaleDateString());
    const fechaActual = fechaNueva.toLocaleDateString();

    const aux = await vericationDate(fechaNueva);
    console.log(aux);


}




async function insertRegistros(data) { //funcion utilizada para insertar estaciones en la base de datos
    const response = await pool.query('select count(*) from estaciones;');
    for (let i = 0; i < data.length; i++) {
        const response2 = await pool.query('insert into estaciones  (codigo, nombre, latitud, longitud, altura) values ($1, $2, $3, $4, $5)', [data[i].codigo_na, data[i].nombre, data[i].latitud, data[i].longitud, data[i].altura]);
    }
};

const insertScraping = async(req, res, data, data2) => { // funcion utilizada para insertar los datos obtenidos del webscraping


    try {
        const fechaNueva = new Date; // para obtener la fecha de hoy
        console.log("esta es la feecha de hoy:", fechaNueva.toLocaleDateString());
        const fechaActual = fechaNueva.toLocaleDateString(); // para convertir la fecha a formato de la base de datos

        let aux = await vericationDate(fechaActual); // funcion utilizada para comprobar si se realizo el registro diario

        console.log(aux);

        if (aux == true) { // si no se realizo el registro true, por ende entra en  el if para insertar los datos
            const respuesta1 = await pool.query('insert into periodo (id_periodo) values ($1)', [fechaActual]); //inserta la fecha en la tabla periodo
            for (let i = 0; i < data.length; i++) { // recore el arreglo con la informacion
                const respuesta2 = await pool.query('insert into indicadores  (codigo_esta, idperiodo, precipitaciones, temp_min, temp_max) values ($1, $2, $3, $4, $5)', [data2[i], fechaActual, data[i].precipitacion, data[i].temp_min, data[i].temp_max]); // inserta los datos en la tabla de hecho de indicadores
            }
            return res.status(200).json({ message: 'Insercion exitosa' });
        } else { // en el caso de ser false, muestra que ya se realizo el registro, por ende no realiza la insercion
            return res.status(204).json({ message: 'Ya se realizo el registro diario' });
        }

    } catch (error) {

        console.log("ese error ocurre por:", error);

    }

}

async function returnCode(data) { // funcion que obtiene el id de la estacion obtenida por web scraping
    const respuesta = await pool.query('SELECT codigo FROM estaciones WHERE nombre = $1', [data]);
    return (respuesta.rows);
};


async function vericationDate(fecha) { //funcion que verifica que la fecha(registro) diario no se haya realizado


    const respuesta = await pool.query('SELECT id_periodo from periodo where id_periodo = $1', [fecha]); //pregunta a la bd si la fecha existe
    console.log(respuesta.rows);

    if (respuesta.rows[0] == null) { //si respuesta esta vacio es por que no se ha hecho el registro, por ende retorna un true
        return true;
    } else {
        console.log("ya se realizo el registro diario"); // si encuentra la fecha y por ende respuesta no esta vacio, retorna un false
        return false;
    }

}

async function vericationStations() { //funcion que verifica que la fecha(registro) diario no se haya realizado


    const respuesta = await pool.query('SELECT * from estaciones'); //pregunta a la bd si hay estaciones
    console.log(respuesta.rows[0]);

    if (respuesta.rows[0] == null) { //si respuesta esta vacio es por que no se ha hecho el registro, por ende retorna un true
        console.log("Se encuentra vacio")
        return true;
    } else {
        console.log("existen estaciones"); // si encuentra estaciones, por ende respuesta no esta vacio, retorna un false
        return false;
    }

}




const webScraping = async(req, res) => { //funcion utilizada para el realizar el web scraping de los registros diarios
    const aux = await vericationStations(); //funcion que verifica si existen estaciones
    if (aux === true) { // en el caso de no existir retorna true
        await scrapingEstaciones(); // realiza el scraping de estaciones y inserta los datos en la base de datos
        const respuesta = await request('https://climatologia.meteochile.gob.cl/application/diario/boletinClimatologicoDiario/actual'); // se obtiene el boletin diario mediante webScraping
        const wwe = cheerio.load(respuesta);
        const data = [];
        wwe("#excel > div > table > tbody > tr").each((index, element) => {
            if ((index == 0) || (index == 1)) return true;
            const tds = wwe(element).find("td");
            let nombre = " " + wwe(tds[0]).text(); // variable que guarda el nombre de la estacion
            let temp_min = wwe(tds[1]).text(); // variable que guarda la temperatura minima
            let temp_max = wwe(tds[3]).text(); // variable que guarda la temperatura maxima
            let precipitacion = wwe(tds[5]).text(); // variable que guarda la temperatura

            if ((temp_min === ' S/P ') || (temp_min === ' . ') || (temp_min === ' - ')) { // se revisa el valor de temp_min en caso de no ser numerico
                temp_min = null;
            } else {
                temp_min = wwe(tds[1]).text(); // se agrega directamente el parametro si es numerico
            }

            if ((temp_max === ' S/P ') || (temp_max === ' . ') || (temp_max === ' - ')) { // se revisa el valor de temp_max en caso de no ser numerico
                temp_max = null;
            } else {
                temp_max = wwe(tds[3]).text(); // se agrega directamente el parametro si es numerico
            }

            if ((precipitacion === ' S/P ') || (precipitacion === ' . ') || (precipitacion === ' - ')) { // se revisa el valor de precipitaciones en caso de no ser numerico
                precipitacion = null;
            } else {
                precipitacion = wwe(tds[5]).text(); // se agrega directamente el parametro si es numerico
            }

            const table_row = {
                nombre,
                temp_min,
                temp_max,
                precipitacion
            };
            data.push(table_row); // se guarda en un arreglo los datos obtenidos
        });

        const data2 = []; // se crea un segundo arreglo

        for (let i = 0; i < data.length; i++) { // se realiza un ciclo for de largo del primer arreglo
            const codigoAux = await returnCode(data[i].nombre); // funcion que obtiene el codigo de la estacion
            const codigoEstacion = codigoAux[0].codigo; // constante que guarda el codigo de la posicion data[i]
            console.log("este es el codigo:", codigoEstacion);
            data2.push(codigoEstacion); // se agrega el codigo al segundo arreglo
        }


        console.log("data:", data);
        console.log("data1:", data.length, "data2:", data2.length); // se visualiza el largo de los dos arreglos quedando del mismo tamaño
        console.log(data2);
        const auxScraping = await insertScraping(req, res, data, data2); // funcion utilizada para insertar los registros del boletin diario en la base de datos

    } else { // en el caso de existir estaciones retorna un false
        const respuesta = await request('https://climatologia.meteochile.gob.cl/application/diario/boletinClimatologicoDiario/actual'); // obtiene el boletin diario mediante webScraping
        const wwe = cheerio.load(respuesta);
        const data = [];
        wwe("#excel > div > table > tbody > tr").each((index, element) => { // accede a los elementos de las diferentes tablas
            if ((index == 0) || (index == 1)) return true;
            const tds = wwe(element).find("td");
            let nombre = " " + wwe(tds[0]).text(); // variable que guarda el nombre de la estacion
            let temp_min = wwe(tds[1]).text(); // variable que guarda la temperatura minima
            let temp_max = wwe(tds[3]).text(); // variable que guarda la temperatura maxima
            let precipitacion = wwe(tds[5]).text(); // variable que guarda la temperatura

            if ((temp_min === ' S/P ') || (temp_min === ' . ') || (temp_min === ' - ')) { // se revisa el valor de temp_min en caso de no ser numerico
                temp_min = null;
            } else {
                temp_min = wwe(tds[1]).text(); // se agrega directamente el parametro si es numerico
            }

            if ((temp_max === ' S/P ') || (temp_max === ' . ') || (temp_max === ' - ')) { // se revisa el valor de temp_max en caso de no ser numerico
                temp_max = null;
            } else {
                temp_max = wwe(tds[3]).text(); // se agrega directamente el parametro si es numerico
            }


            if ((precipitacion === ' S/P ') || (precipitacion === ' . ') || (precipitacion === ' - ')) { // se revisa el valor de precipitaciones en caso de no ser numerico
                precipitacion = null;
            } else {
                precipitacion = wwe(tds[5]).text(); // se agrega directamente el parametro si es numerico
            }

            const table_row = {
                nombre,
                temp_min,
                temp_max,
                precipitacion
            };
            data.push(table_row); // se guarda en un arreglo los datos obtenidos
        });

        const data2 = []; // se crea un segundo arreglo

        for (let i = 0; i < data.length; i++) { // se realiza un ciclo for de tamaño igual al data1 
            const codigoAux = await returnCode(data[i].nombre); // funcion que obtiene el codigo de la estacion del boletin diario
            const codigoEstacion = codigoAux[0].codigo; // constante que guarda el codigo de la estacion
            console.log("este es el codigo:", codigoEstacion);
            data2.push(codigoEstacion); // se guarda el codigo en el arreglo data 2
        }


        console.log("data:", data);
        console.log("data1:", data.length, "data2:", data2.length); // se visualiza el largo de los dos arreglos quedando del mismo tamaño
        console.log(data2);
        const auxScraping = await insertScraping(req, res, data, data2); // funcion utilizada para guardar los datos del boletin diario en la base de datos
    }
}


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'esteban151097',
    database: 'clima',
    port: '5432'
});

/* const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'diego1234',
    database: 'clima',
    port: '5432'
});
 */

module.exports = {
    webScraping,
    scrapingEstaciones,
    test,
    vericationStations
}