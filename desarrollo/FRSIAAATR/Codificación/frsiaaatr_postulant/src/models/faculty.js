const {DataTypes} = require("sequelize");
const {sequelizeDB} = require("../../config/database");

const Faculty = sequelizeDB.define(
    "faculty",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        initials: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Faculty;
