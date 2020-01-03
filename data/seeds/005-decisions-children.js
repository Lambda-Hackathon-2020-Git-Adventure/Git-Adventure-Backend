
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('decisions_children').insert([
    {parent_id: 1, child_id: 2},
    {parent_id: 1, child_id: 3},
    {parent_id: 1, child_id: 4},
    {parent_id: 2, child_id: 5},
    {parent_id: 2, child_id: 6},
    {parent_id: 2, child_id: 7},
    {parent_id: 3, child_id: 8},
    {parent_id: 3, child_id: 9},
    {parent_id: 3, child_id: 10},
    {parent_id: 4, child_id: 11},
    {parent_id: 4, child_id: 12},
    {parent_id: 4, child_id: 13},
  ]);
};
