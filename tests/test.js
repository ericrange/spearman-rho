"use strict";

const _ = require('lodash');
const Spearman = require('../spearman-rho');

describe('Calculating some examples...', function() {

  it('#1: 0.6829', function(done) {
    let x = [2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0];
    let y = [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5];

    let spearman = new Spearman(x, y);
    spearman.calc()
      .then(result => {
        _.isEqual(0.6829268292682927, result) ? done() : done(result);
      })
      .catch(err => console.error(err));
  });

  it('#1: -0.1758', function(done) {
    let x = [106, 86, 100, 101, 99, 103, 97, 113, 112, 110];
    let y = [7, 0, 27, 50, 28, 29, 20, 12, 6, 17];

    let spearman = new Spearman(x, y);
    spearman.calc()
      .then(result => {
        _.isEqual(-0.17575757575757575, result) ? done() : done(result);
      })
      .catch(err => done(err));
  });

});