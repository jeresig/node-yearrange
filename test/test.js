var fs = require("fs");
var assert = require("assert");
var through = require("through");
var JSONStream = require("JSONStream");
var yr = require("../yearrange");
const { start } = require("repl");

yr.debug = true;

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
    { original: '1st day of 10th month of 42nd year of Meiji Period',
      start: 1910,
      end: 1910 },
    { original: 'Tsukimaro (fl. 1800 - 1830)',
      start: 1800,
      end: 1830 },
    { original: "100 Poets" },
    { original: "Kamakura Bofu (鎌倉坊風) (vol. 2, kyoka, covered pleasure-boat at a landing-stage)" },
    { original: 'Gigado Ashiyuki (芦幸) (c.1813-34)',
      start: 1813,
      end: 1834,
      circa: true },
    { original: 'Yamagata Soshin (山形素真) (1818-62)',
      start: 1818,
      end: 1862 },
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
      circa: true },
    { original: 'active Bunka period', start: 1804, end: 1818 },
    {
      original: 'active circa 1880s-early 1900s',
      start: 1880,
      end: 1902,
      circa: true
    },
    {
      original: "February 22, 1822 – August 2, 1866",
      start: 1822,
      end: 1866
    },
    {
      original: "30 April 1839 – 9 June 1892",
      start: 1839,
      end: 1892
    },
    {
      original: "安永6年（1777年） - 弘化3年9月6日（1846年10月25日）",
      start: 1777,
      end: 1846
    },
    {
      original: "寛政10年〈1798年〉 - 没年不明",
      start: 1798,
    },
    {
      original: "寛政5年〈1793年〉‐没年不明",
      start: 1793,
    },
    {
      original: "生年不明 - 文化14年4月25日〈1817年6月9日〉",
      end: 1817,
    },
    {
        "original": "生年不明 ‐ 明治4年〈1871年〉2月29日",
        "end": 1871
    },
    {
      original: "生没年不詳",
    },
    {
      original: "1911-",
      start: 1911,
    },
    {
      original: "1911-?",
      start: 1911,
      circa: true,
    },
    {
      original: "-1911",
      end: 1911,
    },
    {
      original: "?-1911",
      end: 1911,
      circa: true,
    },
    {
      original: "born 1911",
      start: 1911,
    },
    {
      original: "died 1911",
      end: 1911,
    },
];

tests.forEach(test);

fs.createReadStream(__dirname + "/date-tests.json")
    .pipe(JSONStream.parse("*"))
    .on("data", test);
