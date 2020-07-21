const Sequelize = require("sequelize");

const sequelizeDB = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    ssl: true,
    dialectOptions: {
      useUTC: false,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      dateStrings: true,
      typeCast: true,
      timezone: "Etc/GMT+5",
    },
    timezone: "Etc/GMT+5",
    pool: {
      max: 5,
      min: 0,
      require: 30000,
      idle: 10000,
    },
  }
);

module.exports = { sequelizeDB };
