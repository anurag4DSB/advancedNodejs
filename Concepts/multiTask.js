// process.env.UV_THREADPOOL_SIZE = 1;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
    https
        .request('https://www.google.com', res => {
            res.on('data', () => {});
            res.on('end', () => console.log( Date.now() - start));
        })
        .end();
}

let i = 1;
function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log(`Hash-${i}:`, Date.now() - start);
        i++;
    });
}

doRequest();

fs.readFile('multiTask.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
})

doHash();
doHash();
doHash();
doHash();


/**
 * fs module => threadpool
 * crypto.pbkdf2 => threadpool
 * HTTPS => OS (not a part of thread pool so returns results right away or when OS has response)
 *
 * Lets say we have 4 thread pools
 * 1.1) HTTPS => OS => Completion on its own depending on OS response
 * 1.2) FS => thread #1 => read statistics of the file from hard drive
 * 1.3) Hash-1 => thread #2
 * 1.4) Hash-2 => thread #3
 * 1.5) Hash-3 => thread #4
 * 1.6) Hash-4 => wait for a thread
 *
 * 2.1) thread #1 is waiting for some stats of the file from the hard drive so it gets free and is ready for a new task.
 * 2.2) Hash-4 => thread #1
 *
 * 3.1) thread #2 => Hash-1 calculated, callback executed, whats next?
 * 3.2) thread #2 => takes up the task for FS module as we got stats from HDD
 *
 * 4) thread #2 => file ready -> callback, free
 *
 * 5.1) thread #3 => Hash-1 calculated, callback executed, free
 * 5.2) thread #3 => Hash-1 calculated, callback executed, free
 * 5.3) thread #3 => Hash-1 calculated, callback executed, free
 *
 * IMPORTANT: If a thread gets free priority is given to a task waiting for a thread rather than a task which got a
 * response from a pending operation. For example: even if we get the stats of the file back before Hash-4 was assigned
 * to a thread, the next available thread will go to Hash #4 as it was first int he queue.
 */
