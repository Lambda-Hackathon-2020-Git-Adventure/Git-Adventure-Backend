
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('decisions').insert([
    {name: 'Intro', story_id: 1, author_id: 1, text: "You've been on the Triboar Trail for about half a day. As you come around a bend, you spot two dead horses sprawled about fifty feet ahead of you, blocking the path. Each has several black-feathered arrows sticking out of it. The woods press close to the right side of the trail here, with a open field on the left side.", video: "", image: "", first: true},

    {name: 'Bypass the wreckage through the woods to the right', story_id: 1, author_id: 1, text: "As you march through the cover of the woods, you almost collide with a group of 4 goblins who were hiding behind some brush. There are 2 goblin archers and 2 goblins with rusty swords within 15 feet of you.", video: "", image: ""},
    {name: 'Bypass the wreckage by swinging left through an open field', story_id: 1, author_id: 1, text: "You safely bypass the wreckage and continue along the trail.", video: "", image: ""},
    {name: 'Continue on the path', story_id: 1, author_id: 1, text: "As you approach the wreckage a single arrow hits the ground right in front of you. Four goblins run out of the woods and stop on the path in front of you. Two goblin archers post up at a moderate distance and 2 goblins with rusty swords come to confront you.", video: "", image: ""},
    
    
    {name: 'Run away', story_id: 1, author_id: 1, text: "You barely escape the ambush but end up on the trail where you started. How will you preceed?", video: "", image: ""},
    {name: 'Attack the goblin archers first', story_id: 1, author_id: 1, text: "The archers are unable to react to the close range attack. The sword goblins wreck your day though. They rob you and leave you to die on the side of the trail. You need to find help soon.", video: "", image: ""},
    {name: 'Attack the goblins carrying swords first', story_id: 1, author_id: 1, text: "Smart move. The archers are unable to react to the close range attack while you deal with the sword ghablins. You slay three of the goblins and injure 1 of the archers.", video: "", image: ""},

    {name: 'Cross the field with caution', story_id: 1, author_id: 1, text: "You move across the field slowly. After a little time has passed, you see a group of goblins come out of the woods to your right. They start to run towards you.", video: "", image: ""},
    {name: 'Casually walk across the field', story_id: 1, author_id: 1, text: "You move across the field at a normal pace. After you have crossed three-quarters of the field, you see a group of goblins come out of the woods behind and to your right. They start to run towards you.", video: "", image: ""},
    {name: 'Cross the field as quickly as possible', story_id: 1, author_id: 1, text: "You cross the field as quickly as possible and navigate back to the trail without any issues.", video: "", image: ""},

    {name: 'Run away', story_id: 1, author_id: 1, text: "You barely escape the ambush but end up on the trail where you started. How will you preceed?", video: "", image: ""},
    {name: 'Attack', story_id: 1, author_id: 1, text: "You manage to deal with the sword goblins. The archers wreck your day though. They rob you and leave you to die on the side of the trail. You need to find help soon.", video: "", image: ""},
    {name: 'Try to bribe', story_id: 1, author_id: 1, text: "They take your money and walk away. You continue along the path. Suddenly you see an arrow whiz past your head. You are now moving target practice for the goblin archers.", video: "", image: ""},
  ], 'id');
};
