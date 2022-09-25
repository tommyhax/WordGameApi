const fs = require('fs');
const fetch = require('node-fetch');
const dictionary = require('./dict-solutions.js');
const solve = require('./solve.js');
const suggest = require('./suggest.js');
require('./extensions.js');

const configFile = "config-client.json";

const play = (baseUri, green, yellow, gray, t = 0, jsonData = undefined) => {
  var game = undefined;

  if (jsonData) {
    response = JSON.parse(jsonData);

    console.log(response.results);

    game = response.game;

    response.results.map(r => {
      if (r.color === 'green') {
        green = green.replaceAt(r.position, r.letter);
      }
      else if (r.color === 'yellow') {
        yellow[r.position] += r.letter;
      }
      else {
        gray += r.letter;
      }
    });

    yellow = yellow.map(y => y.removeDuplicates());

    gray = gray.split('')
      .filter(x => !(green.includes(x) || yellow.some(y => y.includes(x))))
      .join('')
      .removeDuplicates();
  }

  if (!green.includes('_')) {
    console.log(`Found solution ${response.guess} on play ${t}`);
    return t;
  }

  if (t === 6) {
    console.log(`We lost!`);
    return 0;
  }

  var solutions = solve(dictionary, green, yellow, gray);
  var suggestions = suggest(solutions);
  var guess = suggestions[0];

  console.log(`Guessing ${guess}`);

  var path =`/play?guess=${guess}`;

  if (game) {
    path += `&game=${game}`;
  }

  var uri = baseUri + path;

  fetch(uri)
    .then(res => res.text())
    .then(jsonData => play(baseUri, green, yellow, gray, t + 1, jsonData));
}

fs.readFile(configFile, 'utf8', (err, data) => {
  const config = JSON.parse(data);

  const baseUri = `http://${config.serverHost}:${config.serverPort}`;

  var green = '_____';
  var yellow = [ '', '', '', '', '' ];
  var gray = '';

  play(baseUri, green, yellow, gray);
});
