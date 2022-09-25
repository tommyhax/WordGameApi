const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const apidoc = require('./apidoc.js');
const solutionWords = require('./dict-solutions.js');
const otherWords = require('./dict-others.js');
const results = require('./results.js');

const configFile = 'config-server.json';

const validWords = solutionWords.concat(otherWords);

const log = (req) => console.log(`${new Date()} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} - ${req.originalUrl}`);

const app = express();

app.get('/', (req, res) => {
  res.send(apidoc);
});

app.get('/play', (req, res) => {
  log(req);

  var game = req.query.game;

  if (!game) {
    game = uuid.v4();
  }

  var guess = req.query.guess;

  if (!guess || !validWords.includes(guess)) {
    res.send({
      game: game,
      guess: guess,
      error: "missing or invalid guess"
    });
  }

  guess = guess.toUpperCase();

  const solution = solutionWords[parseInt(game.split(/-/)[4], 16) % solutionWords.length];

  res.send({
    game: game,
    guess: guess,
    results: results(solution, guess)
  });
});

fs.readFile(configFile, 'utf8', (err, data) => {
  const config = JSON.parse(data);

  var server = app.listen(config.serverPort, () => {
    console.log(`${config.appName} v${config.appVersion} server listening on port ${config.serverPort}`);
  });
});

