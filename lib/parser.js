const _ = require('lodash');

module.exports = {
    parseArgs: parseArgs,
    parseOptions: parseOptions,
    parseCrop: parseCrop,
    parseField: parseField,
    parseExtractOptions: parseExtractOptions
};

function parseArgs(args) {
    const parsed = {
        tasks: [],
        options: {},
        mapFunc: _.identity
    };

    if (_.isArray(args[0])) {
        parsed.tasks = args[0];
    } else if (_.isString(args[0])) {
        parsed.tasks.push(args[0]);
    }

    if (_.isFunction(args[1])) {
        parsed.mapFunc = args[1];
    } else if (_.isPlainObject(args[1])) {
        parsed.options = args[1];
    }

    if (_.isFunction(args[2])) {
        parsed.mapFunc = args[2];
    }

    return parsed;
}

function parseOptions(options) {
    const defaultOpts = {
        useragent: 'Scavenger - https://www.npmjs.com/package/scavenger'
    };

    if (!options) {
        return _.assign({}, defaultOpts);
    }

    if (_.isString(options)) {
        return _.assign({ url: options }, defaultOpts);
    }

    if (_.isPlainObject(options)) {
        return _.assign({}, defaultOpts, options);
    }
}

function parseCrop(crop) {
    if (!crop || !crop.length) {
        return [];
    }

    if (_.isString(crop)) {
        return [split(crop)];
    }

    return _.map(crop, split);

    function split(size) {
        if (_.isPlainObject(size)) {
            return size;
        }
        if (_.isString(size)) {
            const splitted = size.split('X');
            return {
                width: splitted[0],
                height: splitted[1]
            };
        }

        return {};
    }
}

function parseExtractOptions(options) {
    if (!options.scope && !options.fields) {
        return {
            fields: options
        };
    }

    return options;
}

function parseField(field) {
    if (_.isString(field)) {
        return {
            selector: field,
            attribute: 'text'
        }
    }

    if (_.isPlainObject(field)) {
        return _.assign({}, {
            attribute: 'text'
        }, field);
    }

    return {};
}
