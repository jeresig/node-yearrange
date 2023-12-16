// Punctuation
// (Both ASCII and Japanese)
// http://www.localizingjapan.com/blog/2012/01/20/regular-expressions-for-japanese-text/
// Include full width characters?
// Exclude the -, ?, /, ~ marks, they're used in some dates
var puncRegex = /[!"#$%&()*+,.:;<=>@[\\\]^_`{|}\u3000-\u303F]/g;

module.exports = {
    extraRules: [
        [/\bca\b|circa|c\s*\d|\bc\b|\?|probably/, function(match, date) {
            date.circa = true;
        }],
        [/(\d+)歳/, function(match, date) {
            if (date.end) {
                // +1 because you start at 1 when born in Japan
                date.start = date.end - match[1] + 1;
            }
        }],
        [/(\d+)(?:nd|th|rd) year.*(?:\b(?:meiji|bunka|reiwa|sh.wa|taish.|heisei|edo)\b|江戸時代)/, function(match, date) {
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
        "last quarter": {
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
        "1st half": {
            start: 0,
            end: -50
        },
        "2nd half": {
            start: 50,
            end: 0
        },
        "early-mid": {
            start: 0,
            end: -40
        },
        "end": {
            start: 75,
            end: 0
        },
        "mid-late": {
            start: 40,
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
        "middle of": {
            start: 40,
            end: -40
        },
        "middle": {
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
        },
        "beginning": {
            start: 0,
            end: -75
        }
    },

    decadeOffset: {
        "mid-late": {
            start: 4,
            end: 0
        },
        "mid to late": {
            start: 4,
            end: 0
        },
        "early-mid": {
            start: 0,
            end: -3
        },
        "early to mid": {
            start: 0,
            end: -3
        },
        "late": {
            start: 7,
            end: 0
        },
        "mid": {
            start: 4,
            end: -3
        },
        "early": {
            start: 0,
            end: -7
        }
    },

    dateRules: [
        [/(\d{3,4})s?\s*[-\/~]\s*(\d{3,4})s/, function(match, date) {
            date.start = match[1];
            date.end = match[2].substr(0, 3) + "9";
        }],
        [/(\d{4})s?\s*[-\/]\s*(\d{4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3,4})s?\s*[-]\s*(\d{3,4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(?:[a-z]+\s+)?(?:\d{1,2}\s+)?(\d{3,4})\s+[-]\s+(?:[a-z]+ )?(?:\d{1,2}\s+)?(\d{3,4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(?:\d{1,2}?\s+)?(?:[a-z]+\s+)?(\d{3,4})\s+[-]\s+(?:\d{1,2}?\s+)?(?:[a-z]+ )?(\d{3,4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3,4})s?[-\/]\s*present/, function(match, date) {
            date.start = match[1];
            date.end = (new Date).getYear() + 1900;
        }],
        [/(\d{3,4})\s*(?:and|or|to|through)\s*(?:c\S*)?\s*(\d{3,4})/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3,4})s?\s*[-\/]\s*(\d{2})s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 2) +
                match[2].substr(0, 1) + "9";
        }],
        [/(\d{3,4})s?\s*[-\/]\s*(\d{2})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = date.start.substr(0, date.start.length - 2) + match[2];
        }],
        [/(\d{3,4})s?\s*[-\/]\s*(\d{1})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = date.start.substr(0, date.start.length - 1) + match[2];
        }],
        [/(\d{3})s?-(\d{4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3})s?\s*[-\/]\s*(\d{2})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 1) + match[2];
        }],
        [/:decadeOffset(\d{3}0)s?(?:\s*[-\/]\s*|\sto\s|\sor\s):decadeOffset(\d{3}0)/, function(match, date) {
            date.start = parseFloat(match[2]);
            date.end = parseFloat(match[4]) + 9;

            if (match[1] in this.decadeOffset) {
                var offset = this.decadeOffset[match[1]];
                date.start += offset.start;
            } else {
                throw "Missing decade offset: " + match[1];
            }

            if (match[3] in this.decadeOffset) {
                var offset = this.decadeOffset[match[3]];
                date.end += offset.end;
            } else {
                throw "Missing decade offset: " + match[3];
            }
        }],
        [/(\d{3}0)s?(?:\s*[-\/]\s*|\sto\s|\sor\s):decadeOffset(\d{3}0)/, function(match, date) {
            date.start = parseFloat(match[1]);
            date.end = parseFloat(match[3]) + 9;

            if (match[2] in this.decadeOffset) {
                var offset = this.decadeOffset[match[2]];
                date.end += offset.end;
            } else {
                throw "Missing decade offset: " + match[2];
            }
        }],
        [/:decadeOffset(\d{3}0)s?(?:\s*[-\/]\s*|\sto\s|\sor\s)(\d{3}0)/, function(match, date) {
            date.start = parseFloat(match[2]);
            date.end = parseFloat(match[4]) + 9;

            if (match[1] in this.decadeOffset) {
                var offset = this.decadeOffset[match[1]];
                date.start += offset.start;
            } else {
                throw "Missing decade offset: " + match[1];
            }
        }],
        [/:decadeOffset(\d{2}[1-9]0)/, function(match, date) {
            date.start = parseFloat(match[2]);
            date.end = date.start + 9;

            if (match[1] in this.decadeOffset) {
                var offset = this.decadeOffset[match[1]];
                date.start += offset.start;
                date.end += offset.end;
            } else {
                throw "Missing decade offset: " + match[1];
            }
        }],
        [/(\d{3}0)s?\s*:decadeOffset/, function(match, date) {
            date.start = parseFloat(match[1]);
            date.end = date.start + 9;

            if (match[2] in this.decadeOffset) {
                var offset = this.decadeOffset[match[2]];
                date.start += offset.start;
                date.end += offset.end;
            } else {
                throw "Missing decade offset: " + match[2];
            }
        }],
        [/:centuryOffset(\d{2})th(?:\s*century\s*|\s*cent\s*)?(?:\s*[-\/]\s*|\sto\s|\sor\s):centuryOffset(\d{2})th (?:century|\s*cent\s*)/, function(match, date) {
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
        [/:centuryOffset(?:\s*[-\/]\s*|\sto\s|\sor\s):centuryOffset(\d{2})th (?:century|\s*cent\s*)/, function(match, date) {
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
        [/:centuryOffset(\d{2})th(?:\s*century\s*|\s*cent\s*)?(?:\s*[-\/]\s*|\sto\s|\sor\s)(\d{2})th (?:century|\s*cent\s*)/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[3]) - 1) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
            } else {
                throw "Missing century offset: " + match[1];
            }
        }],
        [/(\d{2})th(?:\s*century\s*|\s*cent\s*)?(?:\s*[-\/]\s*|\sto\s|\sor\s):centuryOffset(\d{2})th (?:century|\s*cent\s*)/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[3]) - 1) * 100) + 99;

            if (match[2] in this.centuryOffset) {
                var offset = this.centuryOffset[match[2]];
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[2];
            }
        }],
        [/:centuryOffset(\d{2})th (?:century|cent)/, function(match, date) {
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
        [/:centuryOffset(\d{2})00/, function(match, date) {
            date.start = parseFloat(match[2]) * 100;
            date.end = (parseFloat(match[2]) * 100) + 99;

            if (match[1] in this.centuryOffset) {
                var offset = this.centuryOffset[match[1]];
                date.start += offset.start;
                date.end += offset.end;
            } else {
                throw "Missing century offset: " + match[1];
            }
        }],
        [/(\d{2})th(?:\s*century\s*|\s*cent\s*)?(?:\s*[-\/]\s*|\sto\s|\sor\s)(\d{2})(?:th)?\s*(?:century|cent)/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;
        }],
        [/(\d{2})(?:th)?\s+(?:century|\s*cent\s*)/, function(match, date) {
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
        [/(\d{2})00\s*s/, function(match, date) {
            date.start = parseFloat(match[1]) * 100;
            date.end = (parseFloat(match[1]) * 100) + 99;
        }],
        [/(\d{3}0)s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 3) + "9";
        }],
        [/([1-2]\d{3})(?:.*?[^a-z]|)-(?:[^a-z].*?|)([1-2]\d{3})/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/([1-2]\d{3})(?:.*?[^a-z]|)[^a-z]-(?:[^a-z].*?|)没年不明/, function(match, date) {
            date.start = match[1];
        }],
        [/生年不明(?:.*?[^a-z]|)[^a-z]-(?:[^a-z].*?|)([1-2]\d{3})/, function(match, date) {
            date.end = match[1];
        }],
        [/([1-2]\d{3})/, function(match, date) {
            date.start = match[1];
            date.end = match[1];
        }],
        [/(\d{3})[-]/, function(match, date) {
            date.start = match[1] + "0";
            date.end = match[1] + "9";
        }],
        [/(\d{2})[-][-]/, function(match, date) {
            date.start = match[1] + "00";
            date.end = match[1] + "99";
        }],
        [/(\b(?:meiji|bunka|reiwa|sh.wa|taish.|heisei|edo)\b|江戸時代)/, function(match, date) {
            if (match[1] === "meiji") {
                date.start = 1868;
                date.end = 1912;
            } else if (match[1] === "bunka") {
                date.start = 1804;
                date.end = 1818;
            } else if (match[1] === "edo" || match[1] === "江戸時代") {
                date.start = 1603;
                date.end = 1868;
            } else if (match[1] === "heisei") {
                date.start = 1989;
                date.end = 2019;
            } else if (match[1] === "reiwa") {
                date.start = 2019;
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
        [/(\d{2})[-]\d{2}/, function(match, date) {
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

        if (this.debug) {
            console.log("cleaned string", str);
        }

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
            ")(?:\\s*-\\s*|\\s*of\\s+the\\s*|\\s*of\\s*|\\s*)";
        var decadeOffset = "(" + Object.keys(this.decadeOffset).join("|") +
            ")(?:\\s*-\\s*|\\s*of\\s+the\\s*|\\s*of\\s*|\\s*)";

        for (var i = 0; i < this.dateRules.length; i++) {
            var rule = this.dateRules[i];
            rule[0] = new RegExp(rule[0].source
                .replace(/:centuryOffset/g, centuryOffset)
                .replace(/:decadeOffset/g, decadeOffset));
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
        return str
            // Convert malformed apostrophes
            .replace(/â/g, "'")
            // Strip out punctuation
            .replace(puncRegex, " ")
            // Convert 1820's to 1820s
            .replace(/(\d+)'s/g, "$1s")
            // Convert 1820 s to 1820s
            .replace(/(\d+)\s+s\b/g, "$1s")
            // Convert wide dash to hyphen
            .replace(/[–‐]/g, "-")
            // Remove hyphenated words
            .replace(/\b(p?re)-([a-z]+)\b/g, "$1$2")
            .replace(/(pre|post)-(\d)/g, "$1 $2")
            // Strip out extra whitespace
            //.replace(/(\d)\s*-\s*(\d)/g, "$1-$2")
            .replace(/\s+/, " ")
            .trim();
    },

    convertFullWidth: function(str) {
        return str.replace(/[\uFF01-\uFF65]/g, function(n) {
            return String.fromCharCode(n.charCodeAt(0) - 65248);
        });
    }
};