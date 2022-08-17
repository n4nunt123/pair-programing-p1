'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Posts.belongsTo(models.Users, {
        foreignKey: 'UserPostId'
      })
    }

    static sortAndSearch(condition){
      if (Boolean(condition.Newest)) {
        return {
          order: [['createdAt','DESC']]
        }
      } else if (Boolean(condition.Oldest)) {
        return {
          order: [['createdAt','Asc']]
        }
      } else if (condition.search) {
        return {
          where: {
            content: { [Op.iLike]: `%${condition.search}%` } 
          }
        }
      }
    }

    static profilePost(data){
      let listProfile = data.map(el => {
        return el.UserPostId
      })
      return {
        where: {
          UserProfileId: { 
            [Op.or]: listProfile
          }
        }
      }
    }

  }
  Posts.init({
    content: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    UserPostId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};