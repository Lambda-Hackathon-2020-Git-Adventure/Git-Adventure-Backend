
exports.up = function(knex) {
    return knex.schema.createTable('collaborators', tbl => {
      tbl.integer("collaborator")
        .references('id')
        .inTable('users')
      tbl.integer('story')
        .references('id')
        .inTable('stories')
        .onDelete('CASCADE');
      tbl.unique(['collaborator', 'story'])
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('collaborators');
  };
  