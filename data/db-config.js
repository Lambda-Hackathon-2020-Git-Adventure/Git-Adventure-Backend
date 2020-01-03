const knex = require('knex');

const knexConfig = require('../knexfile.js');

const env = process.env.DB_ENV || 'development';

module.exports = knex(knexConfig[env]);