
exports.up = function(knex) {
    return knex.schema.createTable('stories', tbl => {
        tbl.increments();
        tbl.integer('creator')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        tbl.string('title')
            .notNullable()
        tbl.string('description', 9001)
        tbl.varchar('image');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('stories');
};
