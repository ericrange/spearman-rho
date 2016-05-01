"use strict";

const _ = require('lodash');

/* Spearman's rank correlation coefficient */
/* https://de.wikipedia.org/wiki/Rangkorrelationskoeffizient */
class Spearman {
  constructor(X, Y) {
    if (X.length !== Y.length) {
      throw new Error('Datasets do not have the same length.');
    }

    this.n = X.length = Y.length;

    this.X = this.prepare(X);
    this.Y = this.prepare(Y);
  }

  prepare(values) {
    return _.map(values, (value, index) => {
      return {
        index: index++,
        value: value,
        rank: 0
      };
    });
  }

  addRank(values) {
    return _.chain(values)
      .sortBy('value')
      .map((value, index) => {
        value.rank = index++
          return value;
      })
      .value();
  }

  standardizeRank(timeSeries) {
    return _.chain(timeSeries)
      .groupBy('value')
      .map((groupValues) => {
        const groupMean = _.meanBy(groupValues, 'rank');
        return _.map(groupValues, (value) =>
          _.set(value, 'rank', groupMean)
        );
      })
      .flatten()
      .sortBy('index')
      .value();
  }

  d2(X, Y) {
    return _.chain(this.n)
      .times((i) => Math.pow(X[i].rank - Y[i].rank, 2))
      .sum()
      .value();
  }

  Tx(values) {
    return _.chain(values)
      .groupBy('rank')
      .map((value) => _.toInteger(value.length))
      .sumBy((value) => Math.pow(value, 3) - value)
      .value();
  }

  calc() {
    const rankedX = this.addRank(this.X);
    const stdRankedX = this.standardizeRank(rankedX);

    const rankedY = this.addRank(this.Y);
    const stdRankedY = this.standardizeRank(rankedY);

    const sumOfd2 = this.d2(stdRankedX, stdRankedY);

    const Tx = this.Tx(stdRankedX);
    const Ty = this.Tx(stdRankedY);

    const numerator = Math.pow(this.n, 3) - this.n - 0.5 * Tx - 0.5 * Ty - 6 * sumOfd2;
    const denominator = (Math.pow(this.n, 3) - this.n - Tx) * (Math.pow(this.n, 3) - this.n - Ty);

    const rs = denominator <= 0 ? 0 : (numerator / Math.sqrt(denominator));

    return rs;
  }
}

let spearman = new Spearman([2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0], [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5]);
console.log(spearman.calc());
