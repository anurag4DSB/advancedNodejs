process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

// Is the file being executed in master mode?
if (cluster.isMaster) {
    // Cause index.js to be executed *again* but in child mode
    cluster.fork();
    cluster.fork();
} else {
    // I am a child and I am going to act like a server and do nothing else
    const crypto = require('crypto');
    const express = require('express')
    app = express();

    app.get('/', (req, res) => {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            res.send('Hello World');
        });
    })

    app.get('/fast', (req, res) => {
        res.send('This was fast');
    })

    app.listen(3000);
}

/**
 * Apache Benchmarking
 * ab -c 50 -n 500 localhost:3000/fast
 * -c => concurrency
 * -n => number of operations
 */
