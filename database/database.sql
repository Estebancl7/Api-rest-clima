CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE clima;


CREATE TABLE IF NOT EXISTS users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

SELECT * FROM users;

INSERT INTO users(user_email,user_password) VALUES ('bob@email.com','bob');
INSERT INTO users(user_email,user_password) VALUES ('fred@email.com','fred');
INSERT INTO users(user_email,user_password) VALUES ('diego@email.com','diego');





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




INSERT INTO estaciones(codigo, nombre, latitud, longitud, altura) VALUES
    ('180005','Chacalluta, Arica Ap.','-18.35555','-70.34028','50.0'),
    ('200003','Iquique, Cavancha Ap.','-20.23361','-70.14389','9.0'),
    ('220002','El Loa, Calama Ad.','-22.49806','-68.89250','2321.0'),
    ('270008','Desierto de Atacama, Caldera Ad.','-27.25444','-70.78111','197.0'),
    ('320055','Catemu','-32.77111','-70.95389','440.0');

INSERT INTO periodo(id_periodo) VALUES
    ('19-09-2021'),
    ('20-09-2021'),
    ('21-09-2021'),
    ('22-09-2021'),
    ('23-09-2021');

INSERT INTO indicadores(codigo_esta, idperiodo, precipitaciones, temp_max, temp_min) VALUES
    ('180005','20-09-2021','5.0','25.3','30.2'),
    ('200003','20-09-2021','7.0','18.3','27.2'),
    ('180005','21-09-2021','5.0','25.3','30.2'),
    ('200003','21-09-2021','7.0','18.3','27.2'),
    ('220002','20-09-2021','5.0','25.3','30.2'),
    ('270008','20-09-2021','7.0','18.3','27.2'),
    ('220002','19-09-2021','5.0','25.3','30.2'),
    ('270008','19-09-2021','7.0','18.3','27.2'),
    ('180005','22-09-2021','5.0','25.3','30.2'),
    ('200003','23-09-2021','7.0','18.3','27.2');
    
    
INSERT INTO indicadores(codigo_esta, idperiodo, precipitaciones, temp_max, temp_min) VALUES
    ('200003','22-09-2021','5.4','24.7','33.2');

SELECT avg(precipitaciones) from indicadores where codigo_esta = 200003;

SELECT avg(precipitaciones) from indicadores, estaciones  where estaciones.latitud = -20.23361 AND estaciones.longitud = -70.14389;

SELECT avg(precipitaciones) FROM indicadores JOIN estaciones on indicadores.codigo_esta = estaciones.codigo WHERE  estaciones.latitud = -20.23361 AND estaciones.longitud = -70.14389;





