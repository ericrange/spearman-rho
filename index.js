"use strict";

const _ = require('lodash');

/* Spearman's rank correlation coefficient */
/* https://de.wikipedia.org/wiki/Rangkorrelationskoeffizient */
class Spearman {
  constructor(timeSeries1, timeSeries2) {
    if (timeSeries1.length !== timeSeries2.length) {
      throw new Error('Datasets do not have the same length.');
    }

    this._length = timeSeries1.length = timeSeries2.length;

    this.timeSeries1 = this.prepare(timeSeries1);
    this.timeSeries2 = this.prepare(timeSeries2);
  }

  prepare(values) {
    return _.chain(values)
      .map((value, index) => {
        return {
          index: index++,
          value: value,
          rank: 0
        };
      })
      .value();
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
      .map((values) => {
        let mean = _.meanBy(values, 'rank');
        return _.map(values, (value) => {
          value.rank = mean;
          return value;
        });
      })
      .flatten()
      .sortBy('index')
      .value();
  }

  d2(standardizedRankedValues1, standardizedRankedValues2) {
    let tmpSum = 0;
    for (let i = 0; i < this._length; i++) {
      tmpSum += Math.pow(
        standardizedRankedValues1[i].rank - standardizedRankedValues2[i].rank, 2);
    }
    return tmpSum;
  }

  Tx(values) {
    return _.chain(values)
      .groupBy('rank')
      .map((value) => parseInt(value.length))
      .sumBy((value) => Math.pow(value, 3) - value)
      .value();
  }

  calc() {
    let rankedValues1 = this.addRank(this.timeSeries1);
    let standardizedRankedValues1 = this.standardizeRank(rankedValues1);

    let rankedValues2 = this.addRank(this.timeSeries2);
    let standardizedRankedValues2 = this.standardizeRank(rankedValues2);

    let sumOfd2 = this.d2(standardizedRankedValues1, standardizedRankedValues2);

    let T1 = this.Tx(standardizedRankedValues1);
    let T2 = this.Tx(standardizedRankedValues2);

    let rs =
      (Math.pow(this._length, 3) - this._length - 0.5 * T1 - 0.5 * T2 - 6 * sumOfd2) /
      (Math.sqrt((Math.pow(this._length, 3) - this._length - T1) * (Math.pow(this._length, 3) - this._length - T2)));

    console.log(rs);
  }
}

let spearman = new Spearman([2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0], [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5]);
spearman.calc();
