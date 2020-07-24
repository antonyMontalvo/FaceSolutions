const { DataTypes } = require("sequelize");
const { sequelizeDB } = require("../../config/database");

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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = District;
