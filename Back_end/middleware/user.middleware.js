const User = require('../models').User;
const Role = require('../models').Role;
const moment = require('moment');


let verifyCurrentPassword = async function (req, res, next) {
    let err, user, data, currentPassword;
    user = req.user;
    data = req.body;

    currentPassword = data.currentPassword;

    if (currentPassword == undefined)
        return ReE(res, "currentPassword is required", 400);

    [err, user] = await to(user.comparePassword(currentPassword))
    if (err) return ReE(res, "error validating current password", 400);


    next();
}
module.exports.verifyCurrentPassword = verifyCurrentPassword;


let getUser = async function (req, res, next) {
    let user_id, err, user, attributes;
    user_id = req.params.user_id;

    attributes = req.myAttributes || {};

    [err, user] = await to(User.findOne({
        where: {
            id: user_id
        },
        include: [{
            model: Role
        }],
        attributes: attributes
    }))
    if (err) return ReE(res, "err finding user: " + err.message, 500);

    if (!user) return ReE(res, "User not found with id: " + user_id, 404);

    req.user = user;

    next();
}
module.exports.getUser = getUser;


let notSelf = async function (req, res, next) {
    let user_id, err, user;
    user_id = req.params.user_id;
    user = req.user;

    if (user_id == user.id)
        return ReE(res, "you can not preform this action on yourself", 403);

    next();
}
module.exports.notSelf = notSelf;


let getUserByEmail = async function (req, res, next) {
    let err, user, email, body;
    body = req.body;
    if (body === undefined) return ReE(res, "No body found in request. requires body with email", 400);

    email = body.email;
    if (email === undefined) return ReE(res, "email is required", 400);

    [err, user] = await to(User.findOne({
        where: {
            email: email
        },
        include: [{
            model: Role
        }]
    }))
    if (err) return ReE(res, "err finding user: " + err.message, 500);

    if (!user) return ReE(res, "User not found", 404);

    req.user = user;

    next();
}
module.exports.getUserByEmail = getUserByEmail;

let getUserByUsername = async function (req, res, next) {
    let err, user, email, body;
    body = req.body;

    if (body === undefined) return ReE(res, 'No body found in request. Requires body with username', 400);

    username = body.username;
    if (username === undefined) return ReE(res, 'Username is required', 400);

    [err, user] = await to(User.findOne({
        where: {
            username: username
        },
        include: [{
            model: Role
        }]
    }));
    if (err) ReE(res, 'err finding user: ' + err.message, 500);

    if (!user) return ReE(res, 'User not found', 404);

    req.user = user;
    next();
}
module.exports.getUserByUsername = getUserByUsername;

let getUserByforgotpasswordUUID = async function (req, res, next) {
    let err, user, forgotpasswordUUID, body, date, expiry;
    body = req.body;
    if (body === undefined) return ReE(res, "No body found in request. requires body with forgotpasswordUUID", 400);

    forgotpasswordUUID = req.params.forgotpasswordUUID;
    if (forgotpasswordUUID === undefined) return ReE(res, "forgotpasswordUUID is required", 400);

    [err, user] = await to(User.findOne({
        where: {
            forgotpasswordUUID: forgotpasswordUUID
        },
        include: [{
            model: Role
        }]
    }))
    if (err) return ReE(res, "err finding user: " + err.message, 500);

    if (!user) ReE(res, "the forgotpassword link may be invalid or have expired", 404);

    date = moment();
    expiry = moment(user.forgotpasswordExpiry);

    if (moment(user.forgotpasswordExpiry).diff(moment(), 'seconds') < 0)
        return ReE(res, "the forgotpassword link may be invalid or have expired", 403);

    req.user = user;
    req.isForgot = true;

    next();
}
module.exports.getUserByforgotpasswordUUID = getUserByforgotpasswordUUID;


let getRoles = async function (req, res, next) {
    let user, err, roles;
    user = req.user;

    [err, roles] = await to(user.getRoles());

    if (err) return ReE(res, "err finding user roles: " + err.message, 500);

    req.Roles = roles;
    next();
}
module.exports.getRoles = getRoles;

let preventPasswordChange = async function (req, res, next) {
    let body;
    body = req.body;

    if (body.password != undefined) {
        body.password = undefined;
    }

    req.body = body;
    next();
}
module.exports.preventPasswordChange = preventPasswordChange;

let preventSelfRoleChange = async function (req, res, next) {
    let body = req.body;

    if (body.Roles != undefined) {
        body.Roles = undefined;
    }

    req.body = body;
    next();
}
module.exports.preventSelfRoleChange = preventSelfRoleChange;

let setAttributes = async function (req, res, next) {
    let attributes;

    attributes = {
        // include: [],
        exclude: ['password', 'forgotpasswordUUID', 'forgotpasswordExpiry']
    }
    req.myAttributes = attributes;

    next();
}
module.exports.setAttributes = setAttributes;