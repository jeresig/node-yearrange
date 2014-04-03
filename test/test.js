var fs = require("fs");
var assert = require("assert");
var through = require("through");
var JSONStream = require("JSONStream");
var yr = require("../yearrange");

var test = function(date) {
    var result = yr.parse(date.original);
    try {
        assert.deepEqual(result, date, "Parsing: " + date.original);
    } catch(e) {
        console.log("Expected:", date);
        console.log("Result:", result);
        throw e;
    }
};

var tests = [
    { original: '〔 ？ ～ 安政３年（1856）・５３歳〕',
      end: 1856,
      circa: true,
      start: 1804 },
    { original: '〔享保５年（１７２０）～ 寛政５年（１７９３）１２月９日・享年未詳〕',
      start: 1720,
      end: 1793 },
    { original: '〔弘化１年（１８４４）１月 ～ ？ 〕',
      start: 1844,
      circa: true },
    { original: '〔 ？ ～\n安政３年（１８５０）５月２１日・享年未詳〕',
      end: 1850,
      circa: true },
    { original: '〔安永５年（１７７６）～ 天保２年（１８３１）？・５６歳？〕',
      start: 1776,
      end: 1831,
      circa: true }
];

tests.forEach(test);

fs.createReadStream(__dirname + "/date-tests.json")
    .pipe(JSONStream.parse("*"))
    .on("data", test);