"use strict";

const _ = require('lodash');

/* Spearman's rank correlation coefficient */
/* https://de.wikipedia.org/wiki/Rangkorrelationskoeffizient */

class SpearmanRHO {
  constructor(X, Y) {
    if (X.length !== Y.length) {
      throw new Error('Datasets do not have the same length.');
    }

    this.X = X;
    this.Y = Y;
    this.n = X.length = Y.length;
  }

  prepare(values) {
    return new Promise(function (resolve, reject) {
      resolve(_.map(values, (value, index) => {
        return {
          index: index++,
          value: value,
          rank: 0
        };
      }));
    });
  }

  addRank(values) {
    return new Promise(function (resolve, reject) {
      const rank = _.chain(values)
        .sortBy('value')
        .map((value, index) => _.set(value, 'rank', index++))
        .value();

      resolve(rank);
    });
  }

  standardizeRank(timeSeries) {
    return new Promise(function (resolve, reject) {
      const rank = _.chain(timeSeries)
        .groupBy('value')
        .map(groupValues => {
          const groupMean = _.meanBy(groupValues, 'rank');
          return _.map(groupValues, value =>
            _.set(value, 'rank', groupMean)
          );
        })
        .flatten()
        .sortBy('index')
        .value();

      resolve(rank);
    });
  }

  Ed_2(X, Y) {
    return _.chain(this.n)
      .times(i => Math.pow(X[i].rank - Y[i].rank, 2))
      .sum()
      .value();
  }

  T_(values) {
    return _.chain(values)
      .groupBy('rank')
      .map(value => _.toInteger(value.length))
      .sumBy(value => Math.pow(value, 3) - value)
      .value();
  }

  calc() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.prepare(this.X)
        .then(X => this.addRank(X))
        .then(X => this.standardizeRank(X)),

        this.prepare(this.Y)
        .then(Y => this.addRank(Y))
        .then(Y => this.standardizeRank(Y))

      ]).then(values => {
        const X = values[0];
        const Y = values[1];

        Promise.all([this.T_(X), this.T_(Y)])
          .then(values => {
            const Tx = values[0];
            const Ty = values[1];

            const numerator = Math.pow(this.n, 3) - this.n - 0.5 * Tx - 0.5 * Ty - 6 * this.Ed_2(X, Y);
            const denominator = (Math.pow(this.n, 3) - this.n - Tx) * (Math.pow(this.n, 3) - this.n - Ty);

            resolve(denominator <= 0 ? 0 : (numerator / Math.sqrt(denominator)));

          }).catch(err => console.error(err));

      }).catch(err => console.error(err));
    });
  }
}

module.exports = SpearmanRHO;