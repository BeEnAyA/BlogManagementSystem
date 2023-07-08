module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define("blogs", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type:DataTypes.STRING,
        allowNull:true,
      },
    });
    return Blog;
  };