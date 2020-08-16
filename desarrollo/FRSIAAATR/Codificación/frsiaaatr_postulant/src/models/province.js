const {DataTypes} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Department = require("./department");

const Province = sequelizeDB.define(
    "province",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        ubigeo_code: {
            type: DataTypes.STRING,
        },
        department_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

Province.belongsTo(Department, { as: "department", foreignKey: "department_id" });

module.exports = Province;
