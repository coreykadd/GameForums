'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Log', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        action: {
            type: DataTypes.STRING,
            allowNull: true
        },
        item: {
            type: DataTypes.STRING,
            allowNull: true
        },
        itemId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        association: {
            type: DataTypes.STRING,
            allowNull: true
        },
        associationId: {
            type: DataTypes.UUID,
            allowNull: true
        }

    });

    Model.associate = function (models) {
        this.belongsTo(models.User);
    };

    Model.beforeSave(async (user, options) => {
        let err;

    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};