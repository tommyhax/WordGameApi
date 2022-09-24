const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const evaluate = require('./evaluate.js');
const solutionWords = require('./dict-solutions.js');
const otherWords = require('./dict-others.js');

const configFile = 'config-server.json';

const validWords = solutionWords.concat(otherWords);

const gameSolution = (game) => solutionWords[parseInt(game.split(/-/)[4], 16) % solutionWords.length];

const log = (req) => console.log(`${new Date()} - ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} - ${req.originalUrl}`);

const app = express();

app.get('/', (req, res) => {
  log(req);

  res.send({
    endpoints: [
      {
        path: "/",
        method: "GET",
        parameters: null,
        description: "List API endpoints."
      },
      {
        path: "/play",
        method: "GET",
        parameters: [
          {
            name: "guess",
            type: "string",
            required: "true",
            description: "A five-letter guess at the puzzle solution."
          },
          {
            name: "game",
            type: "UUID",
            required: "false",
            description: "The ID of a game in progress.  If omitted, a new game will be started."
          }
        ],
        description: "Start a new game or submit a guess to a game in progress."
      }
    ]
  });
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

  const solution = gameSolution(game);

  res.send({
    game: game,
    guess: guess,
    results: evaluate(solution, guess)
  });
});

fs.readFile(configFile, 'utf8', (err, data) => {
  const config = JSON.parse(data);

  var server = app.listen(config.serverPort, () => {
    console.log(`${config.appName} v${config.appVersion} server listening on port ${config.serverPort}`);
  });
});

