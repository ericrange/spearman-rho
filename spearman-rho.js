"use strict";

const _ = require('lodash');

/* Spearman's rank correlation coefficient */
/* https://de.wikipedia.org/wiki/Rangkorrelationskoeffizient */
module.exports = class SpearmanRHO {
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
    return new Promise(function(resolve, reject) {
      resolve(_.chain(values)
        .sortBy('value')
        .map((value, index) => _.set(value, 'rank', index++))
        .value());
    });
  }

  standardizeRank(timeSeries) {
    return new Promise(function(resolve, reject) {
      resolve(_.chain(timeSeries)
        .groupBy('value')
        .map((groupValues) => {
          const groupMean = _.meanBy(groupValues, 'rank');
          return _.map(groupValues, (value) =>
            _.set(value, 'rank', groupMean)
          );
        })
        .flatten()
        .sortBy('index')
        .value());
    });
  }

  Ed_2(X, Y) {
    return _.chain(this.n)
      .times((i) => Math.pow(X[i].rank - Y[i].rank, 2))
      .sum()
      .value();
  }

  T_(values) {
    return _.chain(values)
      .groupBy('rank')
      .map((value) => _.toInteger(value.length))
      .sumBy((value) => Math.pow(value, 3) - value)
      .value();
  }

  calc() {
    const that = this;
    return new Promise(function(resolve, reject) {
      Promise.all([
        that.addRank(that.X).then((X) => that.standardizeRank(X)),
        that.addRank(that.Y).then((Y) => that.standardizeRank(Y))

      ]).then((values) => {
        const X = values[0], Y = values[1];

        const Tx = that.T_(X);
        const Ty = that.T_(Y);

        const numerator = Math.pow(that.n, 3) - that.n - 0.5 * Tx - 0.5 * Ty - 6 * that.Ed_2(X, Y);
        const denominator = (Math.pow(that.n, 3) - that.n - Tx) * (Math.pow(that.n, 3) - that.n - Ty);

        resolve(denominator <= 0 ? 0 : (numerator / Math.sqrt(denominator)));

      }).catch((err) => console.error(err));
    });
  }
}
