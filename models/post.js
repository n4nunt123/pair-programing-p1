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
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Content can't be empty`
        },
        notEmpty: {
          msg: `Content can't be empty`
        }
      }
    },    
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    UserPostId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};