const {DataTypes} = require("sequelize");
const {sequelizeDB} = require("../../config/database");
const Province = require("./province");

const District = sequelizeDB.define(
    "district",
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
        province_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

District.belongsTo(Province, {as: "province", foreignKey: "province_id"});

module.exports = District;
