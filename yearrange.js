var rules = [
    [/(\d{4})/, function(match, date) {
        date.start = match[0];
        date.end = match[1];
    }]
];

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
    }
};