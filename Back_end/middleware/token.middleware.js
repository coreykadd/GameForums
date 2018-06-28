'use strict'

var jwt = require('jsonwebtoken');
var User = require('../models').User;
var Role = require('../models').Role;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const validateRefresh = async function (req, res, next) {
    let refreshToken, err, user, body, encryption;

    encryption = CONFIG.refresh_encryption;
    body = req.body;
    refreshToken = body.refreshToken;

    if (!refreshToken) {
        return ReE(res, 'refreshToken not found in body', 400);
    }

    // Check storage to see if we have ref to token
    jwt.verify(refreshToken, encryption, async function (err, decoded) {
        if (err) {
            return ReE(res, 'Failed to authenticate refresh token: ' + err.message, 400);
        } else {
            const userId = decoded.user_id;
            const type = decoed.type;

            if (type != 'refresh') {
                return ReE(res, 'Token is not a refresh token', 400);
            }

            [err, user] = await to(User.findOne({
                where: {
                    id: userId
                },
                include: [{
                    model: Role
                }]
            }));

            if (err) return ReE(res, 'err finding token owner: ' + err.message, 400);

            if (!user) {
                return reE(res, 'token owner not found', 404);
            }
        }

        req,user = user;
        next();
    });
}