# cpm-validator [![Build Status](https://travis-ci.org/Interencheres/cpm-validator.svg?branch=master)](https://travis-ci.org/Interencheres/cpm-validator) [![Coverage Status](https://coveralls.io/repos/github/Interencheres/cpm-validator/badge.svg?branch=master)](https://coveralls.io/github/Interencheres/cpm-validator?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/Interencheres/cpm-validator/badges/score.svg)](https://www.bithound.io/github/Interencheres/cpm-validator) [![bitHound Dependencies](https://www.bithound.io/github/Interencheres/cpm-validator/badges/dependencies.svg)](https://www.bithound.io/github/Interencheres/cpm-validator/master/dependencies/npm)

Simple compilation of function for validate type, JSON, ...

## Pré-requis
  * NodeJS 4.2.x

## Installation

```bash
npm install
```

## Usage
To initialize an object, you have to pass an instance of [cpm-logger](https://github.com/interencheres/cpm-logger) :
```
const Validator = require("cpm-validator");
const logger = require("cpm-logger")(myconfig);
const validator = new Validator(logger);
```

### Tests
```bash
npm run tests -s
```

To get coverage with istanbul, you have to run :
```bash
npm run tests:coverage -s
```
