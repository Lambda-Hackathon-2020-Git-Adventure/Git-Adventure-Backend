                                                                                                                                   
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
                                                                                                                                      
                                                                                                                                      

const router = require('express').Router();
const Stories = require('./stories-model');
const Users = require('../../auth/auth-model');
const verifyToken = require('../../auth/authenticate-middleware')

//get stories
router.get('/', (req, res) => {
  Stories.getAll()
    .then(stories => 
      stories.forEach(async (story, idx) => {
        await Stories.getCollaborators(story.id)
          .then(collaborators => stories[idx].collaborators = collaborators)
        res.status(200).json({stories})
      })
    );
});

//get stories that a user created/is a collaborator on
router.get('/mine', verifyToken, async (req, res) => {
  try{
    const result = await Stories.findMine(req.user.id);
    await result.createdStories.forEach(async (story, idx) => {
      const collaborators = await Stories.getCollaborators(story.id)
      result.createdStories[idx].collaborators = collaborators;
      await result.collaboratingOn.forEach(async (story, idx) => {
        const collaborators = await Stories.getCollaborators(story.id)
        result.collaboratingOn[idx].collaborators = collaborators;
        res.status(200).json(result);
      })
    })
  } catch(err){
    console.log(err);
    res.status(500).json({message: 'Error retrieving stories.'})
  }
});

//get story
router.get('/:id', findStory, (req, res) => {
  Stories.getById(req.params.id)
    .then(story => {
      Stories.getCollaborators(req.params.id)
        .then(collaborators => {
          story.collaborators = collaborators
          Stories.findFirst(story.id)
            .then(decision => {
              story.start = decision;
              res.status(200).json({ story })
            })
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({message: "Error accessing database"})
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Error accessing database"})
    });
});

//add story
router.post('/', [verifyToken, validateStory], (req, res) => {
  Stories.add(req.story)
    .then(story => res.status(201).json({ story }))
});

// add collaborator to story
router.post('/:id/collaborator', [verifyToken, findStory, findUser], (req, res) => {
  Stories.addUser({story: req.params.id, collaborator: req.user.id})
    .then(data => {
      res.status(201).json({message: `${req.user.username} successfully added as a collaborator.`})
    })
    .catch(err => {res.status(500).json({message: "Error adding to database"})});
});

// update story
router.put('/:id', [verifyToken, findStory, validAction], (req, res) => {
  const { title, description, image } = req.body;
  Stories.edit(req.params.id, {title, description, image})
    .then(records => res.status(201).json({ records }))
    .catch(err => res.status(500).json({message: "Error updating database"}));
});

// delete story
router.delete('/:id', [verifyToken, findStory, validAction], (req, res) => {
  Stories.remove(req.params.id)
    .then(records => res.status(201).json({ records }))
    .catch(err => res.status(500).json({message: "Error deleting"}));
});

//delete collaborator from story
router.delete('/:id/:username', [verifyToken, findStory, findUserAndValidate], (req, res) => {
  const { collaborator, story } = req.collaborator
  Stories.removeUser(collaborator, story)
    .then(records => res.status(201).json({ records }))
    .catch(err => res.status(500).json({message: "Error deleting"}));
});

function validateStory(req, res, next) {
  const { title, description, image } = req.body;
  if (title) {
    req.story = {creator: req.user.id, title, description, image}
    next();
  } else { 
    res.status(400).json({message: "Title is required"});
  }
}

function findStory(req, res, next) {
  Stories.find(req.params.id)
    .then(story => {
      if (story) {
        req.story = story;
        next();
      } else {
        res.status(404).json({message: "Could not find story"})
      }
    })
    .catch(err => res.status(500).json({message: "Error accessing database"}))
}

function findUser(req, res, next) {
  Users.getUser(req.body.username)
    .then(user => {
      if (user) {
        if (req.user.id == user.id) {
          res.status(403).json({message: "You can not add yourself as a collaborator."})
        } else {
          req.user = user;
          next();
        }
      } else {
        res.status(404).json({message: "Could not find user"})
      }
    })
}

function findUserAndValidate(req, res, next) {
  Users.getUser(req.params.username)
    .then(user => {
      if (user) {
        Stories.findCollaborator(user.id, req.params.id)
          .then(collaborator => {
            if (collaborator) {
              if ( req.user.id == user.id || req.story.creator == req.user.id) {
                req.collaborator = collaborator
                next();
              } else { 
                res.status(403).json({message: "You are not authorized to perform this action."})
              }
            } else {
              res.status(404).json({message: "Could not find collaborator"})
            }
          })
          .catch(err => res.status(500).json({message: "Error accessing database"}))
      } else {
        res.status(404).json({message: "Could not find user"})
      }
    })
    .catch(err => res.status(500).json({message: "Error accessing database"}));
}

function validAction(req, res, next) {
  if (req.story.creator == req.user.id) {
    next()
  } else { 
    res.status(403).json({message: "You are not authorized to make this "})
  }
}
module.exports = router;