'use strict';
const {
  Model
} = require('sequelize');
const { timeFormatter } = require('../helpers/index');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: "UserPostId"
      });
    }

    get formattedTime() {
      return timeFormatter(this.createdAt);
    }
  }
  Post.init({
    content: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    UserPostId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};