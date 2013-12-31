// Punctuation
// (Both ASCII and Japanese)
// http://www.localizingjapan.com/blog/2012/01/20/regular-expressions-for-japanese-text/
// Include full width characters?
// Exclude the -, ?, / marks, they're used in some dates
var puncRegex = /[!"#$%&()*+,.:;<=>@[\\\]^_`{|}~\u3000-\u303F]/g;

module.exports = {
    extraRules: [
        [/\bca\b|circa|c\s*\d|\bc\b|\?/, function(match, date) {
            date.circa = true;
        }]
    ],

    dateRules: [
        [/(\d{4})s?[-\/](\d{4})(?:\s|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{4}) (?:and|or|to|through) (\d{4})/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{4})s?[-\/](\d{4})s/, function(match, date) {
            date.start = match[1];
            date.end = match[2].substr(0, 3) + "9";
        }],
        [/(\d{4})s?[-\/](\d{2})s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 2) +
                match[2].substr(0, 1) + "9";
        }],
        [/(\d{4})s?[-\/](\d{2})(?:\s|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 2) + match[2];
        }],
        [/(\d{2})th[-\/](\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;
        }],
        [/(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[1]) - 1) * 100) + 99;
        }],
        [/(\d{2})(?:th\s*)?c/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[1]) - 1) * 100) + 99;
        }],
        [/(\d{4})s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 3) + "9";
        }],
        [/(\d{3})-/, function(match, date) {
            date.start = match[1] + "0";
            date.end = match[1] + "9";
        }],
        [/(\d{2})--/, function(match, date) {
            date.start = match[1] + "00";
            date.end = match[1] + "99";
        }],
        [/(\d{4})/, function(match, date) {
            date.start = match[1];
            date.end = match[1];
        }]
    ],

    setTestMode: function(mode) {
        this.dateRules.forEach(function(rule) {
            if (mode) {
                rule[0] = (new RegExp(rule[0].source
                    .replace(/\\d/g, "X")));
            } else {
                rule[0] = (new RegExp(rule[0].source
                    .replace(/X/g, "\\d")));
            }
        });
    },

    parse: function(str) {
        var date = {};
        str = this.cleanString(str);

        for (var i = 0; i < this.dateRules.length; i++) {
            var rule = this.dateRules[i];
            var match = rule[0].exec(str);
            if (match) {
                rule[1](match, date);

                for (var prop in date) {
                    if (typeof date[prop] === "string") {
                        date[prop] = parseFloat(date[prop]);
                    }
                }
                break;
            }
        }

        for (var i = 0; i < this.extraRules.length; i++) {
            var rule = this.extraRules[i];
            var match = rule[0].exec(str);
            if (match) {
                rule[1](match, date);
            }
        }

        return date;
    },

    cleanString: function(str) {
        str = str.toLowerCase();
        str = this.stripPunctuation(str);
        return str;
    },

    stripPunctuation: function(str) {
        return str.replace(puncRegex, " ")
            // Convert 1820's to 1820s
            .replace(/(\d+)'s/g, "$1s")
            // Convert wide dash to hyphen
            .replace(/–/g, "-")
            // Strip out extra whitespace
            .replace(/\s+-\s+/g, "-")
            .replace(/\s+/, " ")
            .trim();
    }
};