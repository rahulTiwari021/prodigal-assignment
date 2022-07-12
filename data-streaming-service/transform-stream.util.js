const { Transform } = require('stream');

function transformChunk(resourceId, count) {
    return new Transform({
        objectMode: true,
        decodeStrings: false,
        highWaterMark: 1,
        transform(chunk, encoding, cb) {
            const dataChunk = chunk.toString();
            var formattedData = {
                index: count,
                payload: dataChunk,
                isLastChunk: false,
                resourceId
            };
            return cb(null, JSON.stringify(formattedData));
        },
        flush(cb) {
            this.push(JSON.stringify(
                {
                    index: count,
                    payload: '',
                    isLastChunk: true,
                    resourceId
                }
            ));
            return cb();
        }
    });
}