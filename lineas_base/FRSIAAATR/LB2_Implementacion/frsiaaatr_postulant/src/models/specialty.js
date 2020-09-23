const {DataTypes} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Faculty = require("./faculty");

const Specialty = sequelizeDB.define(
    "specialty",
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
        faculty_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Specialty.belongsTo(Faculty, {as: "faculty", foreignKey: "faculty_id"});

module.exports = Specialty;
