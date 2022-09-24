const GreenValue  = 2; 
const YellowValue = 1;
const BlackValue  = 0;

const score = (guess, target, greenValue = GreenValue, yellowValue = YellowValue, blackValue = BlackValue) => {
  return guess.split('').reduce((acc, cur, idx) =>
    acc + (target.charAt(idx) === cur
      ? greenValue
      : target.includes(cur)
        ? yellowValue
        : blackValue)
    , 0);
}

const best = (results) => {
  function rank (words) {
    var scores = [];

    words.forEach(g => {
      words.forEach(w => {
        scores[g] = (scores[g] ? scores[g] + score(g, w) : score(g, w));
      })
    });

    return Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  }

  return [
    rank(results.filter(r => !r.hasDuplicates()))[0],
    rank(results.filter(r => r.hasDuplicates()))[0]
  ]
  .filter(w => w !== undefined);
};

module.exports = best;
