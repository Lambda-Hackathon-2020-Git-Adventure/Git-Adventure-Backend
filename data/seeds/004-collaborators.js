
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('collaborators').insert([
    {collaborator: 2, story: 1},
  ], 'id');
};
