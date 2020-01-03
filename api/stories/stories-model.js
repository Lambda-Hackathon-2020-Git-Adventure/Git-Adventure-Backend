                                                                                                                                   
//    ____   ____    _________       _____    __ ______      ___      ___      ______     _____      ___   ____   __________ __________ 
//    6MMMMb/ `MM'    `MM`MM`MMb     dMM`MM    d'  `MM`MM\     `M'      `MM\     `M`MM'     `M`MM\     `M'  6MMMMb/ `MMMMMMMMM MMMMMMMMMM 
//   8P    YM  MM      MM MM MMM.   ,PMM MM   d'   MM MMM\     M        MMM\     M MM       M MMM\     M  8P    YM  MM      \ /   MM   \ 
//  6M      Y  MM      MM MM M`Mb   d'MM MM  d'    MM M\MM\    M        M\MM\    M MM       M M\MM\    M 6M      Y  MM            MM     
//  MM         MM      MM MM M YM. ,P MM MM d'     MM M \MM\   M        M \MM\   M MM       M M \MM\   M MM         MM    ,       MM     
//  MM         MMMMMMMMMM MM M `Mb d' MM MMd'      MM M  \MM\  M        M  \MM\  M MM       M M  \MM\  M MM         MMMMMMM       MM     
//  MM         MM      MM MM M  YM.P  MM MMYM.     MM M   \MM\ M        M   \MM\ M MM       M M   \MM\ M MM     ___ MM    `       MM     
//  MM         MM      MM MM M  `Mb'  MM MM YM.    MM M    \MM\M        M    \MM\M MM       M M    \MM\M MM     `M' MM            MM     
//  YM      6  MM      MM MM M   YP   MM MM  YM.   MM M     \MMM        M     \MMM YM       M M     \MMM YM      M  MM            MM     
//   8b    d9  MM      MM MM M   `'   MM MM   YM.  MM M      \MM        M      \MM  8b     d8 M      \MM  8b    d9  MM      /     MM     
//    YMMMM9  _MM_    _MM_MM_M_      _MM_MM_   YM._MM_M_      \M       _M_      \M   YMMMMM9 _M_      \M   YMMMM9  _MMMMMMMMM    _MM_    
                                                                                                                                      
                                                                                                                                      

const db = require('../../data/db-config');

module.exports = {
  getAll,
  getById,
  getCollaborators,
  find,
  edit,
  add,
  remove,
  addUser,
  removeUser,
  findCollaborator,
  findFirst,
  findMine
}

function getAll() {
  return db('stories')
    .join('users', 'users.id', 'stories.creator')
    .where({'stories.published': 1})
    .select('stories.id', 'users.username as creator', 'stories.title','stories.description','stories.image')
}

function getById(id) {
  return db('stories')
    .where({'stories.id': id})
    .join('users', 'users.id', 'stories.creator')
    .select('stories.id', 'users.username as creator', 'stories.title','stories.description','stories.image')
    .first();
}

function getCollaborators(id) {
  return db('collaborators as c')
    .whereRaw(`c.story == ${id}`)
    .join('users as u', 'u.id', 'c.collaborator')
    .select('u.username')
}

async function add(story) {
  try{
      const [id] = await db('stories')
      .insert(story);
      return getById(id)
  }catch(err){
    console.log(err);
    throw err;
  }
  
}

async function edit(id, story) {
  const node = await db('stories')
    .update(story)
    .where({ id })
  return getById(id)
}

function find(id) {
  return db('stories')
    .where({ id })
    .first()
}

function remove(id) {
  return db('stories')
    .where({ id })
    .delete()
}

function addUser(collaborator) {
  return db('collaborators')
    .insert(collaborator)
}

function removeUser(userId, storyId) {
  return db('collaborators')
    .where({ collaborator: userId, story: storyId})
    .delete()
}

function findCollaborator(userId, storyId) {
  return db('collaborators')
    .where({ collaborator: userId, story: storyId })
    .first()  
}

function findFirst(id) {
  return db('decisions')
    .where({story_id: id, first: true})
    .select('id','name','text','author_id','video','image')
    .first()
}

async function findMine(user_id){
    const result = await Promise.all([
      //get stories a user created
      db('stories as s')
      .where({'s.creator': user_id})
      .join('users as u', 's.creator', 'u.id')
      .select('s.title', 's.description', 'u.username as creator', 's.image', 's.published'),
      //get stories that a user is a collaborator for
      db('collaborators as c')
      .where({'c.collaborator': user_id})
      .join('stories as s', 'c.story', 's.id')
      .join('users as u', 'c.collaborator', 'u.id')
      .select('s.title', 's.description', 'u.username as creator', 's.image', 's.published')
    ]);
    const [createdStories, collaboratingOn] = result;
    return {createdStories, collaboratingOn};
}