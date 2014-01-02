var fs = require("fs");
var assert = require("assert");
var through = require("through");
var JSONStream = require("JSONStream");
var yr = require("../yearrange");

fs.createReadStream(__dirname + "/date-tests.json")
    .pipe(JSONStream.parse("*"))
    .on("data", function(date) {
        var result = yr.parse(date.original);
        assert.deepEqual(result, date, "Parsing: " + date.original);
    });