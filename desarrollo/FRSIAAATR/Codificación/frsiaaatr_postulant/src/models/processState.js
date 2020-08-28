const {DataTypes} = require("sequelize");
const {sequelizeDB} = require("../../config/database");

const ProcessState = sequelizeDB.define(
    "process_state",
    {
        idprocess_state: {
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

module.exports = ProcessState;
