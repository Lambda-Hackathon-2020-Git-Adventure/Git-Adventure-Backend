const bcrypt = require('bcryptjs');
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('users').insert([
    {username: 'janmei', password: bcrypt.hashSync('janmei', 12)},
    {username: 'quail', password: bcrypt.hashSync('quail', 12)},
  ], 'id');
};
