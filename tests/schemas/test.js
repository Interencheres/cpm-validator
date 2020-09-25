"use strict";

module.exports = {
    required: ["name", "status", "options"],
    type: "object",
    additionalProperties: false,
    properties: {
        name: {
            type: "object",
            additionalProperties: false,
            anyOf: [
                { required: ["first"] },
                { required: ["second"] }
            ],
            properties: {
                first: {
                    type: "string"
                },
                second: {
                    type: "string"
                }
            }
        },
        nonfloating: {
            type: "integer"
        },
        floating: {
            type: "number"
        },
        description: {
            type: "string"
        },
        status: {
            type: "object"
        },
        options: {
            required: ["name"],
            type: "object",
            additionalProperties: false,
            anyOf: [
                { required: ["name"] }
            ],
            properties: {
                name: {
                    type: "object",
                    additionalProperties: false,
                    anyOf: [
                        { required: ["first"] },
                        { required: ["second"] }
                    ],
                    properties: {
                        first: {
                            type: "string"
                        },
                        second: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
};
