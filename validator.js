"use strict";

const jsonValidator = require("is-my-json-valid");
const _ = require("lodash");
const qs = require("qs");

class Validator {
    constructor (logger) {
        this.logger = logger;
    }

    isInt (value) {
        let numValue = Number(value);
        let isBoolean = (typeof value === "boolean");
        let isInteger = (numValue % 1 === 0);

        return !isBoolean && isInteger;
    }

    inList (value, list) {
        let values = value.split(",");

        for (value of values) {
            if (list.indexOf(value.replace(/^-/, "")) === -1) {
                this.logger.error(`${value.replace(/^-/, "")} not found in list`);
                return false;
            }
        }

        return true;
    }

    isJsonSchemaValid (json, schema) {
        let validate = jsonValidator(schema, { verbose: true, greedy: true });

        if (validate(json)) {
            return true;
        } else {
            this.logger.error(validate.errors);
            return false;
        }
    }

    /**
     * @return boolean
     */
    areFieldsValid (parameters, schema) {
        let errors = [];
        parameters = _.omit(parameters, ["sort", "id", "-id", "created", "-created"]);

        for (let parameter of _.keys(parameters)) {
            this.logger.trace(parameter);
            let field = parameter.replace(/^-/, "");

            // Only get part before bracket, if any
            if (!this.inList(field.split("[")[0], _.keys(schema.properties))) {
                errors.push(`field ${field.split("[")[0]} not valid`);
            } else if (field.includes("[")) {
                // translate string to JSON
                errors = this.checkJson(qs.parse(field), schema, errors);
            } else if (schema.properties[field].type === "object") {
                // re-build a full JSON from its key and value
                let parameterObj = {};
                parameterObj[field] = parameters[field];
                errors = this.checkJson(parameterObj, schema, errors);
            }
        }

        if (errors.length > 0) {
            this.logger.error(errors);
            return false;
        }

        return true;
    }

    /**
     * JSON schema validator for fields, handle '-'
     * append to errors, should probably return a boolean and log them
     * @return list
     */
    checkJson (parameter, schema, errors) {
        let field = _.keys(parameter)[0];
        let value = _.values(parameter)[0];

        if (!this.isJsonSchemaValid(value, schema.properties[field])) {
            errors.push(`field ${JSON.stringify(parameter)} not valid`);
        }

        return errors;
    }
}

module.exports = Validator;
