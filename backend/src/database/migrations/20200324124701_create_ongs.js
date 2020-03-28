exports.up = function(knex) {

    return knex.schema.createTable('ongs', function(table){
        table.string('id').primary();
        table.string('email').notNullable();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.string('phone').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
        table.boolean('confirmed');
    });
};

exports.down = function(knex) {
    knex.schema.dropTable('ongs');
};
