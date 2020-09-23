const {DataTypes} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Specialty = require("./specialty");

const Postulant = sequelizeDB.define(
    "postulant",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        last_name_1: {
            type: DataTypes.STRING,
        },
        last_name_2: {
            type: DataTypes.STRING,
        },
        dni: {
            type: DataTypes.STRING,
        },
        birthdate: {
            type: DataTypes.DATEONLY,
        },
        email: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        cell_phone: {
            type: DataTypes.STRING,
        },
        postulant_code: {
            type: DataTypes.STRING,
        },
        date_postulation: {
            type: DataTypes.DATEONLY,
        },
        state: {
            type: DataTypes.INTEGER,
        },
        acepted_state: {
            type: DataTypes.BOOLEAN,
        },
        firm_path:{
            type: DataTypes.STRING,
        },
        specialty_id: {
            type: DataTypes.INTEGER,
        },
        district_id: {
            type: DataTypes.INTEGER,
        },
        sexo:{
            type: DataTypes.STRING,
        },
        observation: {
            type: DataTypes.TEXT,
        },
        score: {
            type: DataTypes.FLOAT,
        },
        address: {
            type: DataTypes.TEXT,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Postulant.belongsTo(Specialty, {as: "specialty", foreignKey: "specialty_id"});

module.exports = Postulant;
