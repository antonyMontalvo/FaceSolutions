const {DataTypes, fn} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Process = require("./process");
const RequirementState = require("./requirementState");

const Requirement = sequelizeDB.define(
    "requirement",
    {
        idrequirement: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        date_created: {
            allowNull: false,
            defaultValue: fn('now'),
            type: DataTypes.DATE
        },
        date_updated: {
            allowNull: false,
            defaultValue: fn('now'),
            type: DataTypes.DATE
        },
        date_deleted: {
            type: DataTypes.DATE,
        },
        state_requirement: {
            type: DataTypes.INTEGER,
        },
        process_id: {
            type: DataTypes.INTEGER,
        },
        path: {
            type: DataTypes.TEXT,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Requirement.belongsTo(Process, {as: "process", foreignKey: "process_id"});
Requirement.belongsTo(RequirementState, {as: "state", foreignKey: "state_requirement"});

module.exports = Requirement;
