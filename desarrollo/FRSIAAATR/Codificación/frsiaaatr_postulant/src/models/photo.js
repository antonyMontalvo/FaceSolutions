const {DataTypes, fn} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Postulant = require("./postulant");

const Photo = sequelizeDB.define(
    "postulant_requirements",
    {
        idpost_req: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        path: {
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
        observation: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.INTEGER,
        },
        idpostulant: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Photo.belongsTo(Postulant, {as: "postulant", foreignKey: "idpostulant"});

module.exports = Photo;
