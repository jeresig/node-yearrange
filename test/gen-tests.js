var fs = require("fs");
var through = require("through");
var JSONStream = require("JSONStream");
var csv = require("csv-streamify");
var yr = require("../yearrange");

var stream = fs.createReadStream(__dirname + "/date-styles.csv");
var out = fs.createWriteStream(__dirname + "/date-tests.json");

var csvStream = csv({
    delimiter: "\t",
    quote: "|",
    objectMode: true,
    columns: true
});

stream
    .pipe(csvStream)
    .pipe(through(function(data) {
        var date = yr.parse(data.Example);
        if (date.start) {
            this.queue(date);
        }
    }))
    .pipe(JSONStream.stringify())
    .pipe(out);