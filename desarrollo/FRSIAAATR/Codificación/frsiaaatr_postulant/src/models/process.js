const {DataTypes, fn} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Postulant = require("./postulant");
const ProcessState = require("./processState");

const Process = sequelizeDB.define(
    "process",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        code: {
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
        state_process: {
            type: DataTypes.INTEGER,
        },
        administrator_id: {
            type: DataTypes.INTEGER,
        },
        postulant_id: {
            type: DataTypes.INTEGER,
        },
        constancy_id: {
            type: DataTypes.INTEGER,
        },
        document: {
            type: DataTypes.TEXT,
        },
        document_category: {
            type: DataTypes.TEXT,
        },
        document_description: {
            type: DataTypes.TEXT,
        },
        url_constancy: {
            type: DataTypes.TEXT,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Process.belongsTo(Postulant, {as: "postulant", foreignKey: "postulant_id"});
Process.belongsTo(ProcessState, {as: "state", foreignKey: "state_process"});

module.exports = Process;
