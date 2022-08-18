'use strict';
const {
  Model
} = require('sequelize');
const { timeFormatter, dateFormatter, listErrrors } = require('../helpers/index')
const { Op } = require('sequelize')
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
    
    static sortAndSearch(condition){
      if (Boolean(condition.Newest)) {
        return {
          order: [['updatedAt','DESC']]
        }
      } else if (Boolean(condition.Oldest)) {
        return {
          order: [['updatedAt','ASC']]
        }
      } else if (condition.search) {
        return {
          where: {
            content: { [Op.iLike]: `%${condition.search}%` } 
          },
          order: [['updatedAt','DESC']]
        }
      }
    }

    static profilePost(data){
      let listProfile = data.map(el => {
        return el.UserPostId
      })
      let uniqueProfileId = [...new Set(listProfile)]
      return {
        where: {
          UserProfileId: { 
            [Op.or]: uniqueProfileId
          }
        }
      }
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