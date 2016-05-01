"use strict";

const SpearmanRHO = require("./spearman-rho");

const X = [2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0];
const Y = [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5];

const spearmanRHO = new SpearmanRHO(X, Y);
console.log(spearmanRHO.calc());
// 0.6829268292682927
