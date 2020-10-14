/**
 * sets the number of threads. Uncomment to increase or decrease number of threads in the thread pool
 * The OS Thread Scheduler decides which threads goes to which core and even juggles them as well such that each
 * thread gets equal amount of CPU time.
 * Lets say my machine has 4 cores and we have set thread pool size as 5 and each thread execution takes 0.6 seconds.
 * Then each thread will be completed in (5/4) * 0.6 seconds simultaneously.
 * Explanation: 5 threads will get equal time across 4 cores due to the juggling performed by OS Thread Scheduler(5/4).
 * And each thread takes 0.6s which results in (5/4) * 0.6 seconds
 */
process.env.UV_THREADPOOL_SIZE = 5;

const crypto = require('crypto');

const start = Date.now();

/**
 * Node isn't really single threaded. Some expensive tasks are handled by the C++ part of Node(libuv)
 * libuv has a thread pool which has 4 threads by default.
 * This is demonstrated by the below code. The first 4 calls are simultaneous as we have 4 threads but the 5th one has
 * a pause and returns after another thread is available.
 */

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('1:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('2:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('3:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('4:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('5:', Date.now() - start);
});


/**
 * FAQ:
 * Q. Can we use the threadpool for javascript code or can only nodeJS functions use it?
 * A. Yes we can write custom JS that uses the thread pool.
 *
 * Q. What functions in node std library use the threadpool?
 * A. All 'fs' modules functions. Some crypto stuff. And the rest depends on OS(windows vs unix based).
 *
 * Q. How does this thread pool stuff fit into the event loop?
 * A. Tasks running in the threadpool are the 'pendingOperations' in the code example of loop.js
 */
