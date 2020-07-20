const { DataTypes } = require("sequelize");
const { sequelizeDB } = require("../../config/database");

const Department = sequelizeDB.define(
  "department",
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Department;
