const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require('../src/config');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users-routes.js');
const authRouter = require('./routes/auth-routes.js');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const ws = require('./controllers/webscrap.controller');


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = { //configuracion del Swagger 
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            version: "1.0.0",
            title: "API Clima",
            description: "API REST utilizada para realizar webscraping para almacenar esta informacion en una base de datos Postgresql para posteriomente utilizarlos y trabajarlos en diferentes funciones",
            contact: {
                name: "Grupo b",
                email: "diego.salinasg@utem.cl"
            },
            servers: ["http://localhost:3000"]
        },
        components: {
            securitySchemes: { //configuracion de seguridad para reconocer el Token en el swagger
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/grupo-b/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs)); //ruta de acceso al swagger

dotenv.config();

async function daily() {
    await ws.webScraping();

    try {
        setInterval(async() => {
            await ws.webScraping();

        }, config.tiempo)
        app.listen(3000);
        console.log(`Server on port ${app.get('port')}`);
    } catch (error) {
        console.log("A ocurrido un erron en la operacion:", error);
    }
}

daily();



//Configuraciones

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

const corsOptions = { Credentials: true, origin: process.env.URL || '*' };

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser());

//Routes
app.use(require('./routes/index'));
app.use('/grupo-b/users', usersRouter);
app.use('/grupo-b/auth', authRouter);