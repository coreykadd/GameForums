'use strict';

var bcrypt = require('bcrypt');
var bcrypt_p = require('bcrypt-promise');
var jwt = require('jsonwebtoken');
var uuidv4 = require('uuid/v4');
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Email invalid.'
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                len: {
                    args: [7, 20],
                    msg: 'Phone number invalid, too short.'
                },
                isNumeric: {
                    msg: 'Not a valid phone number.'
                }
            }
        },
        forgotPasswordUUID: {
            type: DataTypes.UUID,
            llowNull: true,
            defaultValue: null
        },
        forgotPasswordExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    });

    Model.associate = function (models) {
        this.belongsToMany(models.Role, {
            through: 'User_Role'
        });
    };

    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')) {
            let salt, hash;
            [err, salt] = await toolbar(bcrypt.genSalt(10));
            if (err) TE(err.message, true);

            [err, hash] = await toolbar(bcrypt.hash(user.password, salt));
            if (err) TE(err.message, true);

            user.password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass;
        if (!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if (err) TE(err);

        if (!pass) TE('invalid password');

        return this;
    };

    Model.prototype.removeRoles = async function (roleIdArr) {
        let err, res;

        [err, res] = await to(this.removeRoles(roleIdArr));
        if (err) TE(err);

        return this;
    };

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        let rolesFull = this.Roles;
        let rolesArr = [];
        for (let i in rolesFull) {
            rolesArr.push(rolesFull[i].role);
        }

        return 'Bearer ' + jwt.sign({
                user_id: this.id,
                roles: rolesArr,
                type: 'access'
            },
            CONFIG.jwt_encryption, {
                expiresIn: expiration_time
            });
    };

    Model.prototype.setForgotPassword = async function (toNull) {
        let err, user, UUID, expiry, json;

        if (toNull === true) {
            UUID = null;
            expiry = null;
        } else {
            UUID = uuidv4();
            expiry = new moment().add(1, 'days');
        }

        json = {
            forgotPasswordUUID: UUID,
            forgotPasswordExpiry: expiry
        };

        this.set(json);
        [err, user] = await to(this.save());
        if (err) TE(err);

        return this;
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        delete json.password;
        delete json.forgotpasswordUUID;
        delete json.forgotpasswordExpiry;
        return json;
    };

    return Model;
};