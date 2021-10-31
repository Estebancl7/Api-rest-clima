# Proyecto Api-Rest-clima
Servicio REST, construido en NodeJs y que requiere una conexión a Base de datos (PostgreSQL)

## Entorno de desarrollo recomendado.
Se aconseja usar Ubuntu 20.04 LTS.

## Requerimientos
- NodeJS, tener una version de Node (sudo apt-get install nodejs)
- NPM, tener una version de NPM (sudo apt-get install npm)
- Cliente de base de datos **PostgreSQL** (sudo apt install postgresql postgresql-contrib)
- Docker, se requiere tener instalada una version de Docker, para esto se requieren seguir los pasos indicados en el siguiente link: https://docs.docker.com/engine/install/ubuntu/

## Estructura del proyecto

### Base de datos.
Dentro de la carpeta database existen un conjunto de scripts que se deben ejecutar en orden para utilizar los datos que necesita el servicio rest.

## Ejecución
Lo primero es conectarse a la base de datos, para esto es necesario ejecutar los siguientes comandos:

**sudo -u postgres psql**
**\c clima**

El segundo paso en relacion a la base de datos es:

**restaurar el .sql que se encuentra adjunto en la carpeta Backup db y que contiene todos los datos historicos climatologicos**

El siguiente paso, es instalar las siguientes dependencias para un correcto funcionamiento. 

**sudo npm install -g nodemon**
**sudo apt install node-pre-gyp**
**npm rebuild bcrypt --build-from-source**
**npm run dev**


## Integrantes
- Diego Salinas Gonzalez
- Paulo Vera Chacon
- Esteban Tudela Ortiz



