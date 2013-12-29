var fs = require("fs");
var csv = require("csv-streamify");
var yr = require("../yearrange");

var stream = fs.createReadStream(__dirname + "/date-styles.csv");

var csvStream = csv({
    delimiter: "\t",
    quote: "|",
    objectMode: true,
    columns: true
});

csvStream.on("data", function(data) {
    console.log(data.Example, yr.parse(data.Example));
});

stream.pipe(csvStream);