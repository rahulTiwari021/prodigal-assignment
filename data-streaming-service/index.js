const server = require('http').createServer();
const fs = require('fs');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');


function createFileToStream() {
    const writeStream = fs.createWriteStream('./test.file');
    for(let i=0; i <= 1e6; i++) {
        const data = faker.name.firstName() + ' ' + faker.name.lastName() + ' ' + faker.color.human() + '\n';
        writeStream.write(data);
    }

    writeStream.end();
}

function readFile(res, count, resourceId) {
    const readStream = fs.createReadStream('./test2.file');
    res.setHeader('Content-Type', 'application/json');
    readStream.on('data', chunk => {
        count++;
        var obj = {
            index: count,
            payload: chunk.toString(),
            isLastChunk: false,
            resourceId
        };
        res.write(JSON.stringify(obj));
    });

    readStream.on('end', () => {
        count++;
        var obj = {
            index: count,
            payload: '',
            isLastChunk: true,
            resourceId
        };
        res.write(JSON.stringify(obj));
        res.end();
    });

    readStream.on('error', (error) => {
        console.log(error);
        res.end();
    });
}

function main() {
    //createFileToStream();
}

server.on('request', (req, res) => {
    let count = 0;
    let resourceId = crypto.randomUUID();
    readFile(res, count, resourceId);
});

//main();

server.listen(3001, 'localhost');