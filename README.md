# cpm-validator
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
