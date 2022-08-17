'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Profiles, {
        foreignKey: 'UserProfileId'
      })
      Users.hasMany(models.Posts, {
        foreignKey: 'UserPostId'
      })
    }
  }
  User.init({
    username: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Username Cannot be Null" },
        notEmpty:{ msg: "Username Cannot be Empty" }
      }
    },
    password: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Password Cannot be Null" },
        notEmpty:{ msg: "Password Cannot be Empty" }
      }
    },
    email: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Email Cannot be Null" },
        notEmpty:{ msg: "Email Cannot be Empty" }
      }
    },
    isSuspended: DataTypes.BOOLEAN,
    isAdmin: {
      allowNull:false,
      type: DataTypes.BOOLEAN,
      validate: {
        notNull: { msg: "Role Cannot be Null" },
        notEmpty:{ msg: "Role Cannot be Empty" }
      }
    }
  }, {
    hooks: {
      beforeCreate(instance, opt) {
        const salt = bcrypt.genSaltSync(5)
        const hash = bcrypt.hashSync(instance.password,salt)
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
