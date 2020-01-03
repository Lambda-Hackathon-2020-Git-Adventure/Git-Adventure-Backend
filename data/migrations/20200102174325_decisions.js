exports.up = function(knex) {
    return knex.schema.createTable('decisions', tbl => {
        tbl.increments();
        tbl.string('name')
            .notNullable();
        tbl.string('text', 9001)
            .notNullable();
        tbl.integer('story_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('stories')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        tbl.integer('author_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        tbl.varchar('video');
        tbl.varchar('image');
        tbl.boolean('first')
            .defaultTo(false);
        tbl.integer('timer')
            .unsigned();
    })

    .createTable('decisions_children', tbl => {
        tbl.increments();
        tbl.integer('parent_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('decisions')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        tbl.integer('child_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('decisions')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');    
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('decisions_children')
        .dropTableIfExists('decisions');
};
