'use strict';
const {
  Model
} = require('sequelize');
const { dateFormatter } = require('../helpers/index');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: "UserProfileId"
      });
    }

    get formattedDateOfBirth() {
      return dateFormatter(this.dateOfBirth);
    }
  }
  Profile.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    phoneNumber: DataTypes.INTEGER,
    UserProfileId: DataTypes.INTEGER,
    imageProfileUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};