var rules = [
    [/^(\d{4})$/, function(match, date) {
        date.start = match[0];
        date.end = match[1];
    }]
];

// Punctuation
// (Both ASCII and Japanese)
// http://www.localizingjapan.com/blog/2012/01/20/regular-expressions-for-japanese-text/
// Include full width characters?
// Exclude the -, ?, / marks, they're used in some dates
var puncRegex = /[!"#$%&()*+,.:;<=>@[\\\]^_`{|}~\u3000-\u303F]/g;

module.exports = {
    parse: function(str) {
        var date = {};

        rules.forEach(function(options) {
            var match = options[0].exec(str);
            if (match) {
                options[1](match, date);

                for (var prop in date) {
                    date[prop] = parseFloat(date[prop]);
                }
            }
        });

        return date;
    },

    cleanString: function(str) {
        str = str.toLowerCase();
        str = this.stripPunctuation(str);
        return str;
    },

    stripPunctuation: function(str) {
        return str.replace(puncRegex, " ")
            .replace(/(\d+)'s/g, "$1s")
            .replace(/\s+/, " ")
            .trim();
    }
};