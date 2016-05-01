"use strict";

const SpearmanRHO = require("./spearman-rho");

let spearmanRHO = new SpearmanRHO([2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0], [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5]);
console.log(spearmanRHO.calc());