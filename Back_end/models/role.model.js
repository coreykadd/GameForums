'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Role', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        console.log(models);
        this.belongsToMany(models.User, {
            through: 'User_Role'
        });
    };

    Model.prototype.toWeb = function (pw) {
        const json = this.toJson();
        return json;
    };

    return Model;
};