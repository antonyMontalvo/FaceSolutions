const {DataTypes, fn} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Postulant = require("./postulant");

const Photo = sequelizeDB.define(
    "photo",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        filename: {
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
        state: {
            type: DataTypes.INTEGER,
        },
        postulant_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Photo.belongsTo(Postulant, { as: "postulant", foreignKey: "postulant_id" });

module.exports = Photo;
