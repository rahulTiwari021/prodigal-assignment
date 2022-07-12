const http = require('http');
const server = http.createServer();
const fs = require('fs');

server.on('request', (req, res) => {
    let data = '';
    let body = [];
    let count = 0;
    const { method, url } = req;
    if (method === 'POST' && url === '/webhook') {
        
        req.on('data', chunk => {
            data += chunk;
            body.push(chunk);
        });

        req.on('end', () => {
            count++;
            body = Buffer.concat(body).toString();
            const parsedBody = JSON.parse(body);
            console.log(`parsedBody ${count} =  ${parsedBody}`);
            const writeStream = fs.createWriteStream(`./${parsedBody.resourceId}.file`);
            writeStream.write(body);
        });

        req.on('error', error => {
        console.log('error = ', error);
        });
    }
});

server.listen(5001, 'localhost');

