module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comments", {
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
    return Comment;
  };