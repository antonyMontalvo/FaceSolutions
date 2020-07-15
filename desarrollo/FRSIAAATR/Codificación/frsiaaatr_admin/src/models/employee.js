const { DataTypes } = require("sequelize");
const { sequelizeDB } = require("../../config/database");

const Employee = sequelizeDB.define(
  "employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.TEXT,
    },
    office: {
      type: DataTypes.STRING,
    },
    salary: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Employee;
