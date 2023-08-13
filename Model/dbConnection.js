const dbConfig = require("../Config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, DataTypes)
db.blogs=require("./blog")(sequelize,DataTypes)
db.comments=require("./comment")(sequelize,DataTypes)

//Relation between users and blogs
db.users.hasMany(db.blogs)
db.blogs.belongsTo(db.users)

//Relation between blog and comments
db.blogs.hasMany(db.comments)
db.comments.belongsTo(db.blogs)

//Relation between user and comments
db.users.hasMany(db.comments)
db.comments.belongsTo(db.users)

module.exports = db;
