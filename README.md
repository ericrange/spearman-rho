# Spearman-RHO
Spearman's rank correlation coefficient in NodeJS.

In statistics, Spearman's rank correlation coefficient (or Spearman's rho) is a nonparametric measure of statistical dependence between two variables.

It assesses how well the relationship between two variables can be described using a monotonic function. If there are no repeated data values, a perfect Spearman correlation of +1 or −1 occurs when each of the variables is a perfect monotone function of the other. (Wikipedia)

```shell
npm install spearman-rho --save
```
```javascript
"use strict";

const SpearmanRHO = require("spearman-rho");

const X = [2.0, 3.0, 3.0, 5.0, 5.5, 8.0, 10.0, 10.0];
const Y = [1.5, 1.5, 4.0, 3.0, 1.0, 5.0, 5.0, 9.5];

const spearmanRHO = new SpearmanRHO(X, Y);
console.log(spearmanRHO.calc());
// 0.6829268292682927
```
