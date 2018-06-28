'use strict'

var User = require('./../models').User;
var Role = require('./../models').Role;
var validator = require('validator');
var Log = require('./../models').Log;

const getUniqueKeyFromBody = function (body) {
    let unique_key = body.unique_key;
    if (typeof unique_key === 'undefined') {
        if (typeof body.email != 'undefined') {
            unique_key = body.email
        } else if (typeof body.username != 'undefined') {
            unique_key = body.username
        } else {
            unique_key = null;
        }
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async function (userInfo) {
    let unique_key, auth_info, err;

    auth_info = {};
    auth_info.status = 'create';

    unique_key = getUniqueKeyFromBody(userInfo);
    if (!unique_key) TE('An email or username was not entered.');

    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(User.create(userInfo));
        if (err) TE('User already exists with that email');

        return user;
    } else if (validator.isAlpha(unique_key, 'any')) {
        auth_info.method = 'username';
        userInfo.username = unique_key;

        [err, user] = await to(User.create(userInfo));
        if (err) TE('User already exists with that username');

        return user;
    } else {
        TE('A valid email or phone number was not entered.');
    }
}
module.exports.createUser = createUser;

const authUser = async function (userInfo) {
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if (!unique_key) TE('Please enter an email or username to login');

    if (!userInfo.password) TE('Please enter a password to login');

    let user;
    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';

        [err, user] = await to(User.findOne({
            where: {
                email: unique_key
            },
            include: [{
                model: Role
            }]
        }));
        if (err) TE(err.message);

        return user;
    } else if (validator.isAlpha(unique_key, 'any')) {
        auth_info.method = 'username';

        [err, user] = await to(User.findOne({
            where: {
                username: unique_key
            }
        }));
        if (err) TE(err.message);

        return user;
    } else {
        TE('A valid email or phone number was not entered.');
    }

    if (!user) TE('Not registed');

    [err, user] = await to(user.comparePassword(userInfo.password));
    if (err) TE(err.message);

    Log.create({
        UserId: user.id,
        action: 'Login'
    });

    return user;
}
modeule.exports.authUser = authUser;