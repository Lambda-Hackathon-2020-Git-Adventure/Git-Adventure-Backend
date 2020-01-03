const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Auth = require('./auth-model');
const { generateToken } = require('./token');

router.post('/signup', validateAuth, (req,res) => {
  req.user.password = bcrypt.hashSync(req.user.password, 12);
  Auth.register(req.user)
    .then(id => res.status(201).json({ id }))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Error while registering"})
    })
});

router.post('/login', validateAuth, (req, res) => {
  const { username, password } = req.body;

  Auth.getUser(username.toLowerCase())
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(201).json({token});
      } else {
        console.log('that', user)
        res.status(403).json({message:"Incorrect Credentials"});
      }
    })
    .catch(err => res.status(500).json({message: "Error accessing database."}))
});

router.get('/:id', validateAuth, (req, res) => {
  Auth.getUserById(req.params.id)
    .then(token => {
      res.status(201).json({token});
    })
    .catch(err => res.status(500).json({message: "Error accessing database."}))
      // res.status(403).json({message:"Incorrect Credentials"});

});

router.put('/:id', validateAuth, (req, res) => {
  Auth.updateUser(req.params.id, req.body)
    .then(token => {
      res.status(201).json({token});
    })
    .catch(err => res.status(500).json({message: "Error accessing database."}))
      // res.status(403).json({message:"Incorrect Credentials"});

});

router.delete('/:id', validateAuth, (req,res) => {
  Auth.remove()
  .then(id => res.status(201).json({ id }))
  .catch(err => res.status(500).json({message: "Error accessing database."}))
})

function validateAuth(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    req.user = {username: username.toLowerCase(), password}
    next();
  } else {
    res.status(400).json({message: "Please provide username and password"})
  }
}

module.exports = router;