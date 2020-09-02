const {DataTypes, fn} = require("sequelize");
const {sequelizeDB} = require("../../config/database");

const RequirementState = sequelizeDB.define(
    "requirement_state",
    {
        idrequirement_state: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        state_name: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = RequirementState;
