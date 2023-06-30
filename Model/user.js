module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type:DataTypes.STRING,
        allowNull:true,
      },
      otp:{
        type:DataTypes.INTEGER,
        allowNull:true,
      }
    });
    return User;
  };