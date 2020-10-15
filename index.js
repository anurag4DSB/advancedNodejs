
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const crypto = require('crypto');
const express = require('express')
const { Worker} =  require('webworker-threads');


const app = express();

app.get('/', (req, res) => {
    // cannot use variables outside the closure scope in Worker thread. It executed separately
    // We use function keyword purposely. If we use () => {}, the keyword 'this' will correspond to route handler
    // and not the worker.
    const worker = new Worker(function()  {
        this.onmessage = function()  {
            let counter = 0;
            while (counter < 1e9) {
                counter++;
            }
            postMessage(counter);
        }

    });

    worker.onmessage = function(message) {
        console.log(message.data);
        // if we send a number in res.send express thinks its status code.
        res.send(`${message.data}`);
    }

    worker.postMessage();
})

app.get('/fast', (req, res) => {
    res.send('This was fast');
})

app.listen(3000);

/**
 * Apache Benchmarking
 * ab -c 50 -n 500 localhost:3000/fast
 * -c => concurrency
 * -n => number of operations
 */
