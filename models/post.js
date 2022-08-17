'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize')
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
