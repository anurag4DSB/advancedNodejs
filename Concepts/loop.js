/**
 * fake code to emulate event loop
 * Below we describe the entire life cycle of a node application from starting it up to exiting back to the terminal
 * as a Pseudocode
 */

// book-keeping for pending operations
// new timers, tasks, operations are recorded from myFile running(myFile.runConcents())
const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

/**
 * # 1
 *
 * $ node myFile.js
 * When the above command is run, the event loop does not immediately get executed.
 * At the very start first invoke node and feed in a file, node takes the contents of the myFile.js file and executes
 * all the code inside of it, all the code that we wrote.
 */
myFile.runContents();

/**
 * # 3
 *
 * like while loop checks a condition before running the body of the loop, node checks a condition before letting
 * event loop execute one more time. Here the condition is represented by `shouldContinue`. If returns falsy then we
 * exit the while loop and end the program. Similarly, every single time an event loop is about to be executed, node
 * first does a quick check to decide whether or not it should allow the loop to proceed, for another iteration.
 * If node decides the loop should not be entered and should not be executed again then the body, the entire event loop
 * gets skipped and the program exits back to the terminal
 * NodeJS does 3 separate checks to decide whether the event loop should be executed for another iteration.
 */
function shouldContinue() {
    // Check one: Any pending setTimeout, setInterval, setImmediate?
    // Check two: Any pending OS tasks? (like server listening to some given port)
    // Check three: Any pending long running operations? (Like function call in the fs module for reading file from HDD)
    return pendingTimers.length || pendingOSTasks.length || pendingOSTasks.length;
}

/**
 * # 2
 *
 * After the contents of the file are executed we immediately run nodejs event loop.
 * Here the event loop is represented by a while loop. A while loop with run again and again and again.
 * In each run it executes the body. In event loop execution of this body is known as a 'Tick'.
 * Every single time an event loop runs inside of our node application we refer to it as one tick.
 * In short, entire body executes in one 'tick'
 */
while(shouldContinue()) {
    // Step one: Node looks at pendingTimers and sees if any function are ready to be called(any timeouts expired?)
    // - setTimeout, setInterval

    // Step two: Node looks at pendingOSTasks or pendingOperations and calls relevant callbacks (Example: some request
    // comes into some port that the server is listening on or if some file has been successfully retrieved off HDD.
    // Then during this stage node will detect that these steps have been completed and will call the relevant
    // callbacks, like callback to receive a file thats been fetched or can be a callback to handle an incoming request)

    // Step three: Pause execution(different from while loop). During this pause node just sits around and waits for
    // new events to occur. Continue when...
    // - a new pendingOSTask is done
    // - a new pendingOperation is done
    // - a timer is about to complete/expire

    // Step four: Look at pendingTimers.Call any setImmediate

    // Step five: Handle any 'close' events
    // - Example: readStream.on('close', () => console.log('cleanupCode'))
}

// exit back to terminal
