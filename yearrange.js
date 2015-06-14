// Punctuation
// (Both ASCII and Japanese)
// http://www.localizingjapan.com/blog/2012/01/20/regular-expressions-for-japanese-text/
// Include full width characters?
// Exclude the -, ?, /, ~ marks, they're used in some dates
var puncRegex = /[!"#$%&()*+,.:;<=>@[\\\]^_`{|}\u3000-\u303F]/g;

module.exports = {
    extraRules: [
        [/\bca\b|circa|c\s*\d|\bc\b|\?/, function(match, date) {
            date.circa = true;
        }],
        [/(\d+)歳/, function(match, date) {
            if (date.end) {
                // +1 because you start at 1 when born in Japan
                date.start = date.end - match[1] + 1;
            }
        }],
        [/(\d+)(?:nd|th|rd) year.*(?:\b(?:meiji|sh.wa|taish.|heisei|edo)\b|江戸時代)/, function(match, date) {
            if (date.start) {
                date.start = date.end = date.start + (match[1] - 0);
            }
        }]
    ],

    centuryOffset: {
        "first quarter": {
            start: 0,
            end: -75
        },
        "second quarter": {
            start: 25,
            end: -50
        },
        "third quarter": {
            start: 50,
            end: -25
        },
        "fourth quarter": {
            start: 75,
            end: 0
        },
        "1st quarter": {
            start: 0,
            end: -75
        },
        "2nd quarter": {
            start: 25,
            end: -50
        },
        "3rd quarter": {
            start: 50,
            end: -25
        },
        "4th quarter": {
            start: 75,
            end: 0
        },
        "first half": {
            start: 0,
            end: -50
        },
        "second half": {
            start: 50,
            end: 0
        },
        "end": {
            start: 75,
            end: 0
        },
        "late": {
            start: 75,
            end: 0
        },
        "mid": {
            start: 40,
            end: -40
        },
        "middle": {
            start: 40,
            end: -40
        },
        "middle of": {
            start: 40,
            end: -40
        },
        "early": {
            start: 0,
            end: -75
        },
        "start": {
            start: 0,
            end: -75
        }
    },

    dateRules: [
        [/(\d{3,4})s?[-\/~](\d{3,4})s/, function(match, date) {
            date.start = match[1];
            date.end = match[2].substr(0, 3) + "9";
        }],
        [/(\d{4})s?[-\/](\d{4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3,4})s?[-](\d{3,4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3,4})s?[-\/]\s*(present)/, function(match, date) {
            date.start = match[1];
            date.end = (new Date).getYear() + 1900;
        }],
        [/(\d{3,4}) (?:and|or|to|through) (\d{3,4})/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3,4})s?[-\/](\d{2})s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 2) +
                match[2].substr(0, 1) + "9";
        }],
        [/(\d{3,4})s?[-\/](\d{2})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = date.start.substr(0, date.start.length - 2) + match[2];
        }],
        [/(\d{3,4})s?[-\/](\d{1})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = date.start.substr(0, date.start.length - 1) + match[2];
        }],
        [/(\d{3})s?-(\d{4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3})s?[-\/](\d{2})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 1) + match[2];
        }],
        [/:centuryOffset(\d{2})th(?:\s*[-\/]\s*|\sto\s|\sor\s):centuryOffset(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[4]) - 1) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
            } else {
                throw "Missing century offset: " + match[1];
            }

            if (match[3] in this.centuryOffset) {
                var offset = this.centuryOffset[match[3]];
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[3];
            }
        }],
        [/:centuryOffset(?:\s*[-\/]\s*|\sto\s|\sor\s):centuryOffset(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[3]) - 1) * 100;
            date.end = ((parseFloat(match[3]) - 1) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
            } else {
                throw "Missing century offset: " + match[1];
            }

            if (match[2] in this.centuryOffset) {
                var offset = this.centuryOffset[match[2]];
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[2];
            }
        }],
        [/:centuryOffset(\d{2})th(?:\s*[-\/]\s*|\sto\s|\sor\s)(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[3]) - 1) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
            } else {
                throw "Missing century offset: " + match[1];
            }
        }],
        [/(\d{2})th(?:\s*[-\/]\s*|\sto\s|\sor\s):centuryOffset(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[3]) - 1) * 100) + 99;

            if (match[2] in this.centuryOffset) {
                var offset = this.centuryOffset[match[2]];
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[2];
            }
        }],
        [/:centuryOffset(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[1];
            }
        }],
        [/(\d{2})th(?:\s*[-\/]\s*|\sto\s|\sor\s)(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;
        }],
        [/(\d{2})(?:th)?\s+century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[1]) - 1) * 100) + 99;
        }],
        [/:centuryOffset(\d{2})(?:th\s*)?c/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[1];
            }
        }],
        [/(?:^|\D)(\d{2})(?:th)?\s*[cｃ](?:\W|$)/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[1]) - 1) * 100) + 99;
        }],
        [/(\d{4})[\s\S]*?~[\s\S]*?(\d{4})/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/[?][\s\S]*?~[\s\S]*?(\d{4})/, function(match, date) {
            date.end = match[1];
        }],
        [/(\d{4})[\s\S]*?~[\s\S]*?[?]/, function(match, date) {
            date.start = match[1];
        }],
        [/(\d{4})s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 3) + "9";
        }],
        [/([1-2]\d{3})/, function(match, date) {
            date.start = match[1];
            date.end = match[1];
        }],
        [/(\d{3})-/, function(match, date) {
            date.start = match[1] + "0";
            date.end = match[1] + "9";
        }],
        [/(\d{2})--/, function(match, date) {
            date.start = match[1] + "00";
            date.end = match[1] + "99";
        }],
        [/(\b(?:meiji|sh.wa|taish.|heisei|edo)\b|江戸時代)/, function(match, date) {
            if (match[1] === "meiji") {
                date.start = 1868;
                date.end = 1912;
            } else if (match[1] === "edo" || match[1] === "江戸時代") {
                date.start = 1603;
                date.end = 1867;
            } else if (match[1] === "heisei") {
                date.start = 1989;
                // This is a bit weird, should probably be dynamic
                date.end = (new Date).getYear() + 1900;
            } else if (match[1].indexOf("taish") === 0) {
                date.start = 1912;
                date.end = 1926;
            } else if (match[1].indexOf("sh") === 0) {
                date.start = 1926;
                date.end = 1989;
            }
        }],
        [/(\d{2})-\d{2}/, function(match, date) {
            date.start = "19" + match[1];
            date.end = "19" + match[1];
        }],
        [/・\d{2}・(\d{2})/, function(match, date) {
            date.start = "19" + match[1];
            date.end = "19" + match[1];
        }]
    ],

    parse: function(str) {
        if (!str) {
            return;
        }

        if (typeof str !== "string") {
            return str;
        }

        this.processDateRules();

        var date = {
            original: str
        };

        str = this.cleanString(str);

        for (var i = 0; i < this.dateRules.length; i++) {
            var rule = this.dateRules[i];
            var match = rule[0].exec(str);
            if (match) {
                if (this.debug) {
                    console.log("hit", rule[0]);
                }

                if (!date) {
                    date = {};
                }

                rule[1].call(this, match, date);

                for (var prop in date) {
                    if (typeof date[prop] === "string" && prop !== "original") {
                        date[prop] = parseFloat(date[prop]);
                    }
                }
                break;
            }
        }

        if (date.start || date.end) {
            for (var i = 0; i < this.extraRules.length; i++) {
                var rule = this.extraRules[i];
                var match = rule[0].exec(str);
                if (match) {
                    if (this.debug) {
                        console.log("extra hit", rule[0]);
                    }

                    rule[1].call(this, match, date);
                }
            }
        }

        return date;
    },

    processDateRules: function() {
        if (this.dateRulesProcessed) {
            return;
        }

        var centuryOffset = "(" + Object.keys(this.centuryOffset).join("|") +
            ")(?:\\s*|\\s*-\\s*|\\s*of\\s*)";

        for (var i = 0; i < this.dateRules.length; i++) {
            var rule = this.dateRules[i];
            rule[0] = new RegExp(rule[0].source
                .replace(/:centuryOffset/g, centuryOffset));
        }

        this.dateRulesProcessed = true;
    },

    cleanString: function(str) {
        str = this.convertFullWidth(str);
        str = str.toLowerCase();
        str = this.stripPunctuation(str);
        return str;
    },

    stripPunctuation: function(str) {
        return str.replace(puncRegex, " ")
            // Convert 1820's to 1820s
            .replace(/(\d+)'s/g, "$1s")
            // Convert 1820 s to 1820s
            .replace(/(\d+)\s+s\b/g, "$1s")
            // Convert wide dash to hyphen
            .replace(/–/g, "-")
            // Strip out extra whitespace
            .replace(/\s*-\s*/g, "-")
            .replace(/\s+/, " ")
            .trim();
    },

    convertFullWidth: function(str) {
        return str.replace(/[\uFF01-\uFF65]/g, function(n) {
            return String.fromCharCode(n.charCodeAt(0) - 65248);
        });
    }
};