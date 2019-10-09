function cons(head, tail) {
    const stream = {
        head, 
        tail,
        isCons: () => true,
        isEmpty: () => false,
        scan: (acc, nil) => scan(acc, nil, stream),
        take: n => take(n, stream),
        drop: n => drop(n, stream),
        toArray: () => toArray(stream),
        map: f => map(f, stream),
        reduce: (acc, nil) => reduce(acc, nil, stream),
        concat: right => concat(stream, right),
        repeat: n => repeat(n, stream),
        cycle: () => repeat(Number.POSITIVE_INFINITY, stream),
        zip: right => zip(stream, right)
    };
    return stream;
}

function empty() {
    const stream = {
        isCons: () => false,
        isEmpty: () => true,
        scan: (acc, nil) => scan(acc, nil, stream),
        take: n => take(n, stream),
        drop: n => drop(n, stream),
        toArray: () => toArray(stream),
        map: f => map(f, stream),
        reduce: (acc, nil) => reduce(acc, nil, stream),
        concat: right => concat(stream, right),
        repeat: n => repeat(n, stream),
        cycle: () => repeat(Number.POSITIVE_INFINITY, stream),
        zip: right => zip(stream, right)
    };
    return stream;
}

function scan(acc, nil, stream) {
    if (stream.isEmpty()) {
        return empty();
    } else {
        const next = acc(stream.head, nil);
        return cons(next, () => scan(acc, next, stream.tail()));
    }
}

function take(n, stream) {
    if (n === 0 || stream.isEmpty()) {
        return empty();
    } else {
        return cons(stream.head, () => take(n - 1, stream.tail()));
    }
}

function drop(n, stream) {
    if (n === 0) {
        return stream;
    } else {
        return drop(n - 1, stream.tail());
    }
}

function toArray(stream) {
    if (stream.isEmpty()) {
        return [];
    } else {
        return [stream.head].concat(toArray(stream.tail()));
    }
}

function map(f, stream) {
    if (stream.isEmpty()) {
        return empty();
    } else {
        return cons(f(stream.head), () => map(f, stream.tail()));
    }
}

function reduce(acc, nil, stream) {
    let result = nil;
    while (!stream.isEmpty()) {
        result = acc(stream.head, result);
        stream = stream.tail();
    }
    return result;
}

function concat(left, right) {
    if (left.isEmpty()) {
        return cons(right.head, () => right.tail());
    } else {
        return cons(left.head, () => concat(head.tail(), right));
    }
}

function from(...args) {
    if (args.length === 0) {
        return empty();
    } else {
        return cons(args[0], () => from(...args.slice(1)));
    }
}

function repeat(n, stream) {
    if (stream.isEmpty()) {
        return empty();
    } else {
        const helper = substream => substream.isEmpty() ? repeat(n - 1, stream) : cons(substream.head, () => helper(substream.tail()));
        return helper(stream);
    }
}

function iterate(start, stop, next) {
    const helper = current => stop(current) ? empty() : cons(current, () => helper(next(current)));
    return helper(start);
}

function zip(left, right) {
    if (left.isEmpty() || right.isEmpty()) {
        return empty();
    } else {
        return cons([left.head, right.head], () => zip(left.tail(), right.tail()));
    }
}

module.exports = {
    cons, empty, from, iterate, zip
};



