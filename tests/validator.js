/*jshint expr: true*/
"use strict";

const config = {
    name: "cpm-validator",
    files: {
        enable: false,
        path: "/var/log/cpm-validator",
        name: "indb",
        level: "info"
    },
    logstash: {
        enable: false,
        name: "dev-cpm-validator",
        host: "localhost",
        port: 5710,
        level: "warn"
    }
};

const Validator = require("../validator");
const logger = require("cpm-logger")(config);
const validator = new Validator(logger);
const schema = require("./schemas/test");
require("chai").should();

describe("Core validators", function () {
    describe("Validate integer", function () {
        it("integer", function () {
            validator.isInt(34).should.be.true;
        });
        it("integer as string", function () {
            validator.isInt("34").should.be.true;
        });
        it("string of value 1", function () {
            validator.isInt("1").should.be.true;
        });
        it("string of value 0", function () {
            validator.isInt("0").should.be.true;
        });
        it("string of value 0x1", function () {
            validator.isInt("0x1").should.be.true;
        });
    });

    describe("External reference", function () {
        it("external reference", function () {
            validator.isExternalReference("09-35002-201301251900090000-9852").should.be.true;
        });

        it("invalid external reference", function () {
            validator.isExternalReference("some-stuff").should.be.false;
        });
    });

    describe("Invalidate integer", function () {
        it("float", function () {
            validator.isInt(34.5).should.be.false;
        });
        it("float as string", function () {
            validator.isInt("34.5").should.be.false;
        });
        it("float with comma as string", function () {
            validator.isInt("34,5").should.be.false;
        });
        it("boolean of value true", function () {
            validator.isInt(true).should.be.false;
        });
        it("boolean of value false", function () {
            validator.isInt(false).should.be.false;
        });
        it("real string", function () {
            validator.isInt("not a number").should.be.false;
        });
    });

    describe("Validate is in list", function () {
        let testlist = ["first", "second", "third-element"];

        it("plain alpha string", function () {
            validator.inList("first", testlist).should.be.true;
        });
        it("prepended with a dash", function () {
            validator.inList("-second", testlist).should.be.true;
        });
        it("string containing a dash and prepended with a dash", function () {
            validator.inList("-third-element", testlist).should.be.true;
        });
    });

    describe("Invalidate is in list", function () {
        let testlist = ["first", "second", "third"];

        it("not in list", function () {
            validator.inList("fourth", testlist).should.be.false;
        });
        it("in list but appended with a dash", function () {
            validator.inList("first-", testlist).should.be.false;
        });
        it("in list but prepended with two dash", function () {
            validator.inList("--second", testlist).should.be.false;
        });
    });

    describe("Validate schema", function () {
        it("minimal JSON", function () {
            let payload = { name: { first: "" }, status: {} , options: { name: { first: "fubar" } } };
            validator.isJsonSchemaValid(payload, schema).should.be.true;
        });
        it("full JSON", function () {
            let payload = {
                name: { first: "", second: "" },
                description: "",
                nonfloating: 42,
                floating: 42.5,
                status: {},
                options: {
                    name: { first: "fubar", second: "foo" }
                }
            };
            validator.isJsonSchemaValid(payload, schema).should.be.true;
        });
    });

    describe("Invalidate schema", function () {
        it("empty JSON", function () {
            let payload = {};
            validator.isJsonSchemaValid(payload, schema).should.be.false;
        });
        it("wrong field", function () {
            let payload = {
                name: { first: "" },
                status: {},
                options: {
                    name: { first: "this is my name" }
                },
                foo: ""
            };
            validator.isJsonSchemaValid(payload, schema).should.be.false;
        });
        it("wrong key in object field", function () {
            let payload = {
                name: { first: "", third: "" },
                status: {},
                options: {
                    name: { first: "this is my name" }
                }
            };
            validator.isJsonSchemaValid(payload, schema).should.be.false;
        });
        it("wrong type for object field", function () {
            let payload = {
                name: { first: 1 },
                status: {},
                options: {
                    name: { first: "this is my name" }
                }
            };
            validator.isJsonSchemaValid(payload, schema).should.be.false;
        });
    });

    describe("Check areFieldsValid", function () {
        it("Valid JSON", function () {
            let payload = {
                name: { first: "", second: "" },
                description: "",
                nonfloating: 42,
                floating: 42.5,
                status: {},
                options: {
                    name: { first: "fubar", second: "foo" }
                }
            };
            validator.areFieldsValid(payload, schema).should.be.true;
        });
        it("Check complex field", function () {
            let payload = { "name[first]": "test" };
            validator.areFieldsValid(payload, schema).should.be.true;
        });
        it("Check complex field error", function () {
            let payload = { "name[foo]": "test" };
            validator.areFieldsValid(payload, schema).should.be.false;
        });
        it("wrong field", function () {
            let payload = {
                name: { first: "" },
                status: {},
                foo: ""
            };
            validator.areFieldsValid(payload, schema).should.be.false;
        });
        it("wrong key in object field", function () {
            let payload = {
                name: { first: "", third: "" },
                status: {}
            };
            validator.areFieldsValid(payload, schema).should.be.false;
        });
        it("wrong type for object field", function () {
            let payload = {
                name: { first: 1 },
                status: {}
            };
            validator.areFieldsValid(payload, schema).should.be.false;
        });
    });

    describe("Check isPathValid", function () {
        it("Valid path", function () {
            let payload = {
                options: {
                    name: { first: "" }
                }
            };
            validator.isPathValid(payload, schema).should.be.true;
        });
        it("Valid path regardless of its invalid type", function () {
            let payload = {
                options: {
                    name: { first: 100 }
                }
            };
            validator.isPathValid(payload, schema).should.be.true;
        });
        it("Valid partial path", function () {
            let payload = {
                options: {
                    name: ""
                }
            };
            validator.isPathValid(payload, schema).should.be.true;
        });
        it("Valid paths", function () {
            let payload = [
                {
                    created: ""
                },
                {
                    name: { first: "" }
                },
                {
                    description: ""
                }
            ];
            validator.arePathsValid(payload, schema).should.be.true;
        });
        it("Valid paths from string", function () {
            let payload = [
                "name[first]",
                "description"
            ];
            validator.arePathsValid(payload, schema).should.be.true;
        });
        it("Invalid path", function () {
            let payload = {
                options: {
                    foo: ""
                }
            };
            validator.isPathValid(payload, schema).should.be.false;
        });
        it("One invalid path", function () {
            let payload = [
                {
                    name: { first: "" }
                },
                {
                    description: ""
                },
                {
                    name: { foo: "" }
                }
            ];
            validator.arePathsValid(payload, schema).should.be.false;
        });
    });
});
