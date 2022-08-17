'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users, {
        foreignKey: 'UserProfileId'
      })
    }
  }
  Profiles.init({
    firstName: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "First Name Cannot be Null" },
        notEmpty:{ msg: "First Name Cannot be Empty" }
      }
    },
    lastName: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Last Name Cannot be Null" },
        notEmpty:{ msg: "Last Name Cannot be Empty" }
      }
    },
    gender: {
      allowNull:false,
      type: DataTypes.STRING,
      validate: {
        notNull: { msg: "Gender Cannot be Null" },
        notEmpty:{ msg: "Gender Cannot be Empty" }
      }
    },
    dateOfBirth: {
      allowNull:false,
      type: DataTypes.DATE,
      validate: {
        notNull: { msg: "Date of Birth Cannot be Null" },
        notEmpty:{ msg: "Date of Birth Cannot be Empty" }
      }
    },
    phoneNumber: {
      allowNull:false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: { msg: "Phone Number Cannot be Null" },
        notEmpty:{ msg: "Phone Number Cannot be Empty" }
      }
    },
    UserProfileId: DataTypes.INTEGER,
    imageProfileUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profiles',
  });
  return Profiles;
};