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
    let tmp = [];
    _.map(values, (value, index) => {
      tmp.push({
        index: index + 1,
        value,
        rank: null
      })
    });
    return tmp;
  }

  addRank(timeSeries) {
    return _.map(timeSeries, (val, index) => {
      val.rank = index + 1
      return val;
    });
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

  Tx(values) {
    return _.chain(values)
      .groupBy('rank')
      .map((value) => parseInt(value.length))
      .sumBy((value) => Math.pow(value, 3) - value)
      .value();
  }

  calc() {
    let sortByValues1 = _.sortBy(this.timeSeries1, 'value');
    let rankedValues1 = this.addRank(sortByValues1);
    let standardizedRankedValues1 = this.standardizeRank(rankedValues1);

    let sortByValues2 = _.sortBy(this.timeSeries2, 'value');
    let rankedValues2 = this.addRank(sortByValues2);
    let standardizedRankedValues2 = this.standardizeRank(rankedValues2);

    let sumRankDiffSquared = 0;
    for (let i = 0; i < this._length; i++) {
      sumRankDiffSquared += Math.pow(
        standardizedRankedValues1[i].rank - standardizedRankedValues2[i].rank, 2);
    }

    let T1 = this.Tx(standardizedRankedValues1);
    let T2 = this.Tx(standardizedRankedValues2);

    let rs =
      (Math.pow(this._length, 3) - this._length - 0.5 * T1 - 0.5 * T2 - 6 * sumRankDiffSquared) /
      (Math.sqrt((Math.pow(this._length, 3) - this._length - T1) * (Math.pow(this._length, 3) - this._length - T2)));

    console.log(rs);
  }
}

let spearman = new Spearman([2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0], [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5]);
spearman.calc();
