# Node.js Year Range Parser

A Node.js library for parsing year range strings and converting them into usable dates. This library is only designed to handle year ranges (all month/day information is discarded).

Its usage is best explained through some examples:

    var yr = require("yearrange");

    yr.parse("1877")
    // {"start": 1877, "end": 1877}
    
    yr.parse("1847-48")
    // {"start": 1847, "end": 1848}
    
    yr.parse("ca. 1810-20s")
    // {"start": 1810, "end": 1829, "circa": true}
    
    yr.parse("18th–19th century")
    // {"start": 1700, "end": 1899}
    
    yr.parse("Meiji era")
    // {"start": 1868, "end": 1912}

Many more examples can be found in the `test/date-tests.json` file.

This library was originally built for parsing dates from museums, universities, galleries, and dealers for [Ukiyo-e.org](http://ukiyo-e.org/) by [John Resig](http://ejohn.org/).

## API

In essence there is only a single generally-useful  method exposed:

### `parse(dateString)`

This method takes in a single argument: A string holding the year range. The method returns an object representing the date range.

For example an object after calling `parse("1877")` might look like:

    {"original":"1877","start":1877,"end":1877}

If no valid date is matched by the parser then `undefined` is returned instead.

## License

The library is released under an MIT license.