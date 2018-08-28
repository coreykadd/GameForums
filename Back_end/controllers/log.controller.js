const Log = require('../models/').Log;
const logService = require('../services').logService;

const get = async function (req, res) {
    res.setHeaders('Content-Type', 'application/json');
    let log = req.log;

    return ReS(res, {
        log: log.toWeb()
    });
}
module.exports.get = get;

const update = async function (req, res) {
    let err, log, data;
    log = req.log;
    data = req.body;
    log.set(data);

    [err, log] = await to(log.save());
    if (err) {
        if (err) return ReE(res, 'Error updating log:' + err.message, 500);
    }

    return ReS(res, {
        message: 'Updated log: ' + log.id
    });
}
module.exports.update = update;

const remove = async function (req, res) {
    let log, err;
    log = req.log;

    [err, log] = await to(log.destroy());
    if (err) return ReE(res, 'error occured trying to delete log: ' + err.message, 500);

    return ReS(res, {
        message: 'Deleted log'
    }, 200);
}
module.exports.remove = remove;




const getMany = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, logs, paginationData;

    paginationData = req.paginationData;

    [err, logs] = await to(Log.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: paginationData.limit,
        offset: paginationData.offset,
        include: [{
            model: User,
            attributes: ['first', 'last', 'username', 'email']
        }]
    }));
    if (err) {
        return ReE(res, "err finding logs: " + err.message, 500)
    };

    if (!logs) return ReE(res, "Nothing found", 404);

    return ReS(res, {
        logs: logs,
        paginationData: paginationData
    });
}
module.exports.getMany = getMany;



const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;

    let err, log;

    [err, log] = await to(logService.createLog(body));

    if (err) return ReE(res, "error creating log: " + err.message, 500);
    return ReS(res, {
        message: 'Successfully created new log.',
        log: log.toWeb()
    }, 201);
}
module.exports.create = create;