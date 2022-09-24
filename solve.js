// Usage: solve(green, yellow, gray)
//
// Parameters:
//   green: a string of five letters representing the partial solution, using known letters and/or blanks (underscores)
//   yellow: an array of five strings of letters known to be in the solution but not at the corresponding position
//   gray: a string of forbidden letters
//
// Example:
//   solve('____E', [ '', 'T', 'E', 'T', 'O' ], 'SRNPLA');

const amb = xs => f =>
  xs.reduce((a, x) => a.concat(f(x)), []);
 
const when = p =>
  xs => p ? (xs) : [];

const validLetter = function (green, yellow, gray, i, x) {
  return gray.indexOf(x) === -1 && (green.charAt(i) === '_' || green.charAt(i) === x) && (yellow[i] === '' || yellow[i].indexOf(x) === -1);
}

const validWord = function (yellow, word) {
  return yellow.join('').split('').every(letter => word.indexOf(letter) !== -1);
}

// letters-first implementation (slower)
const _solve = (dictionary, green, yellow, gray) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return amb(alphabet)
    (w0 => when(validLetter(green, yellow, gray, 0, w0))
      (amb(alphabet)
        (w1 => when(validLetter(green, yellow, gray, 1, w1))
          (amb(alphabet)
            (w2 => when(validLetter(green, yellow, gray, 2, w2))
              (amb(alphabet)
                (w3 => when(validLetter(green, yellow, gray, 3, w3))
                  (amb(alphabet)
                    (w4 => when(validLetter(green, yellow, gray, 4, w4) && validWord(yellow, [w0, w1, w2, w3, w4].join('')) && dictionary.includes([w0, w1, w2, w3, w4].join('')))
                      ([ [w0, w1, w2, w3, w4].join('') ]))))))))));
}

// word-first implementation (faster)
const solve = (dictionary, green, yellow, gray) => {
  return amb(dictionary)
    (w => when(
      validLetter(green, yellow, gray, 0, w[0]) &&
      validLetter(green, yellow, gray, 1, w[1]) &&
      validLetter(green, yellow, gray, 2, w[2]) &&
      validLetter(green, yellow, gray, 3, w[3]) &&
      validLetter(green, yellow, gray, 4, w[4]) && validWord(yellow, w))
	([ w ]));
};

module.exports = solve;
