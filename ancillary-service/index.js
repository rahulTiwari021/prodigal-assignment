const http = require('http')
const server = http.createServer();
const axios = require('axios');

server.on('request', async (request, response) => {
    var data = "";
    const parsedData = [];
    const body = [];
    const dataStreamBaseUrl = 'http://localhost:3001/';
    let count = 0;
    const request2 = http.get(dataStreamBaseUrl, res => {
        res.on('data', chunk => {
            count++;
            data += chunk;
            const parsedChunk = Buffer.from(chunk).toString();
            parsedData.push(parsedChunk);
            body.push(chunk);
        });

        res.on('end', () => {
            const postBody = processData(parsedData);
            triggerWebhook(postBody);
            response.end();
        });
    });

    request2.on('error', error => {
        console.log('error = ', error);
    });

    request.on('error', error => {
        console.log('error = ', error);
    });
});

function triggerWebhook(postBody) {
    return axios
    .post('http://localhost:5001/webhook', postBody);
}

function convertStringToJson(item) {
    let str = item.replace(/[{}]/g, '');
    let arr = str.split(',');
    let obj = {};
    for(let item of arr) {
        let keyValue = item.split(':');
        let key = keyValue[0]?.replace(/"/g, '');
        let value = keyValue[1]?.replace(/"/g, '');
        if(key && value) {
            obj[key] = value;
        }
    }
    return obj;
}

function processData(parsedResults) {
    const processedData = [];
    let finalProcessedData = [];
    let resourceId = '';
    for(let item of parsedResults) {
        const obj = convertStringToJson(item);
        if(obj.index) {
            processedData.push(obj);
            let payload = obj.payload;
            resourceId = obj.resourceId;
            let arr = payload?.split(' ');
            if(arr) {
                finalProcessedData = countWordLength(arr);
                console.log(arr);
            }
        }
    }
    return {
        finalProcessedData,
        resourceId
    };
}

function countWordLength(arr) {
    for(let i=0; i < arr.length; i++) {
        const wordLeng = arr[i].length;
        console.log(`word = ${arr[i]} and wordLeng = ${wordLeng}`);
        arr.splice(i, 1, wordLeng.toString());
    }
    return arr;
}

server.listen(4001, 'localhost');