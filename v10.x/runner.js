
function doRun(event, context, handler) {
    //TODO Expose some of the context variable as env
    //Like API Host
    let msg = event
    Object.keys(msg).forEach(
        function (k) {
            if(typeof msg[k] === 'string' && k !== 'value'){
                process.env['__OW_' + k.toUpperCase()] = msg[k];
            }
        }
    );

    return run(handler, msg.value).then(function(result) {
        if (typeof result !== "object") {
            console.error('Result must be of type object but has type "' + typeof result + '":', result);
        }
        return result;
    }).catch(function (error) {
        console.error(error);
        return Promise.reject(error);
    });
}

function run(handler, args) {
    return new Promise(
        function (resolve, reject) {
            try {
                //Result can itself be a promise or an object
                var result = handler(args);
            } catch (e) {
                reject(e);
            }

            // Non-promises/undefined instantly resolve.
            Promise.resolve(result).then(function (resolvedResult) {
                // This happens, e.g. if you just have "return;"
                if (typeof resolvedResult === "undefined") {
                    resolvedResult = {};
                }
                resolve(resolvedResult);
            }).catch(function (error) {
                // A rejected Promise from the user code maps into a
                // successful promise wrapping a whisk-encoded error.

                // Special case if the user just called `reject()`.
                if (!error) {
                    resolve({ error: {}});
                } else {
                    resolve({ error: error });
                }
            });
        }
    );
}

module.exports = doRun;