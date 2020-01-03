
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('stories').insert([
    {creator: 1, title: 'The Lost Mine of Phandelver', description: "In the city of Neverwinter, a dwarf named Gundren Rockseeker asked you to bring a wagon load of provisions to the rough-and-tumble settlement of Phandalin, a couple of days' travel southeast of the city. Gundren was clearly excited and more than a little secretive about his reasons for the trip, saying only that he and his brothers had found something big, and that he'd pay you ten gold pieces each for escorting his supplies safely to Barthen's Provisions, a trading post in Phandalin. He then set out ahead of you on horse, along with a warrior escort named Sildar Haliwinter, claiming he needed to arrive early to take care of business.", image: ''},
  ], 'id');
};
