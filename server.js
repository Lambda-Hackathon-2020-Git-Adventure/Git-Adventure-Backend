const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const server = express();

const authenticate = require('./auth/authenticate-middleware');
const authRouter = require('./auth/auth-router');
const storiesRouter = require('./api/stories/stories-router');
const nodesRouter = require('./api/nodes/nodes-router');

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use('/api/auth', authRouter);
server.use('/api/stories', authenticate, storiesRouter);
server.use('/api/nodes', authenticate, nodesRouter);

server.get("/", (req, res) => {
  res.send("Welcome to Git Adventure API")
})

module.exports = server;