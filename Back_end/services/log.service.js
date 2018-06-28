var Log = require('./../models').Log;

const createLog = async function(logInfo) {
    let log, err;

    [err, log] = await to(Log.create(logInfo));
    if (err) Text('Error creating log: ' + err.message);

    return log;
}

module.exports.createLog = createLog;