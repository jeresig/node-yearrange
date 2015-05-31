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

    dateRules: [
        [/(\d{4})s?[-\/~](\d{4})s/, function(match, date) {
            date.start = match[1];
            date.end = match[2].substr(0, 3) + "9";
        }],
        [/(\d{4})s?[-\/](\d{4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{4})s?[-\/]\s*(present)/, function(match, date) {
            date.start = match[1];
            date.end = (new Date).getYear() + 1900;
        }],
        [/(\d{4}) (?:and|or|to|through) (\d{4})/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{4})s?[-\/](\d{2})s/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 2) +
                match[2].substr(0, 1) + "9";
        }],
        [/(\d{4})s?[-\/](\d{2})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 2) + match[2];
        }],
        [/(\d{4})s?[-\/](\d{1})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 3) + match[2];
        }],
        [/(\d{3})s?-(\d{4})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[2];
        }],
        [/(\d{3})s?[-\/](\d{2})(?:\D|$)/, function(match, date) {
            date.start = match[1];
            date.end = match[1].substr(0, 1) + match[2];
        }],
        [/(late|early|mid(?:dle)?)\s+(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;

            if (match[1] === "late") {
                date.start += 75;
            } else if (match[1].indexOf("mid") === 0) {
                date.start += 40;
                date.end -= 40;
            } else if (match[1] === "early") {
                date.end -= 75;
            }
        }],
        [/(\d{2})th(?:[-\/]|\sto\s)(\d{2})th century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;
        }],
        [/(\d{2})(?:th)?\s+century/, function(match, date) {
            date.start = (parseFloat(match[1]) - 1) * 100;
            date.end = ((parseFloat(match[1]) - 1) * 100) + 99;
        }],
        [/(late|early|mid(?:dle)?)\s+(\d{2})(?:th\s*)?c/, function(match, date) {
            date.start = (parseFloat(match[2]) - 1) * 100;
            date.end = ((parseFloat(match[2]) - 1) * 100) + 99;

            if (match[1] === "late") {
                date.start += 75;
            } else if (match[1].indexOf("mid") === 0) {
                date.start += 40;
                date.end -= 40;
            } else if (match[1] === "early") {
                date.end -= 75;
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

                rule[1](match, date);

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

                    rule[1](match, date);
                }
            }
        }

        return date;
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