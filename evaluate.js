module.exports = (solution, guess) => {
  var green = [];
  var yellow = [];
  var jskip = [];

  for (let i = 0; i < 5; ++i) {
    if (guess.charAt(i) === solution.charAt(i)) {
      green.push(i);
    }
  }

  for (let i = 0; i < 5; ++i) {
    if (green.includes(i)) {
      continue;
    }
    for (let j = 0; j < 5; ++j) {
      if (green.includes(j) || jskip.includes(j)) {
        continue;
      }
      if (guess.charAt(i) === solution.charAt(j)) {
        yellow.push(i);
        jskip.push(j);
        break;
      }
    }
  }

  return guess.split('')
    .map((a, i) => {
      return {
        position: i,
        letter: a,
        color: green.includes(i) ? 'green' : yellow.includes(i) ? 'yellow' : 'gray'
      }
    });
};
