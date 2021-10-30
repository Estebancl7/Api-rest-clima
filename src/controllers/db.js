const pg = require('pg');
const { Pool } = pg;

/* let localPoolConfig = {
    user: 'postgres',
    password: 'guitarslayer3',
    host: 'localhost',
    port: '5432',
    database: 'clima'
}; */

/* let localPoolConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'diego1234',
    database: 'clima',
    port: '5432'
}; */
let localPoolConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'esteban151097',
    database: 'clima',
    port: '5432'
};
const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
} : localPoolConfig;

const pool = new Pool(poolConfig);
module.exports = pool;