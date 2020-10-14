const https = require('https');

const start = Date.now();

/**
 * Neither Node not libuv has any code to handle all of the super low level operations that are involved with a network
 * request. Instead libuv delegates the request making to the underlying OS. So its the OS which makes the actual HTTP
 * request. libuv is used to issue the request. Then it just waits on the OS to emit a signal that some response has
 * come back to the request/ So because libuv is delegating the work to the OS, the OS itself whether to make a new
 * thread of now or just generally how to handle the entire process of making the request. Because the OS is making the
 * request there is no blocking of JS code inside of our event loop or anything else inside our application. Everything
 * or all the work is being done by OS itself and we are not touching the threadpool in this case.
 */
function doRequest() {
    // res is not the data. It's an object that emits events.
    https
        .request('https://www.google.com', res => {
            res.on('data', () => {});
            res.on('end', () => console.log( Date.now() - start));
        })
        .end();
}

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();

/**
 * FAQ:
 * Q. What functions in the node std library use the OS's async feature?
 * A. Almost everything around networking for all OS's(making requests, receiving requests, or setting up a listener
 * on a port) and some other stuff OS specific.
 *
 * Q. How does this OS async stuff fit into the event loop?
 * A. Tasks using the underlying OS are reflected in out 'pendingOSTasks' array in loop.js.
 */
