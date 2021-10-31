CREATE DATABASE clima;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS estaciones (
    codigo int primary key,
    nombre varchar(1000),
    latitud float,
    longitud float,
    altura float
);

CREATE TABLE IF NOT EXISTS periodo(
    id_periodo DATE PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS indicadores(
    id_indicadores serial primary key,
    codigo_esta INT,
    idperiodo DATE,
    precipitaciones float,
    temp_max float,
    temp_min float,
    CONSTRAINT fk_estaciones
        FOREIGN KEY(codigo_esta)
            REFERENCES estaciones(codigo),

    CONSTRAINT fk_periodo
        FOREIGN KEY(idperiodo)
            REFERENCES periodo(id_periodo)
);



