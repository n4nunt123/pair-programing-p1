'use strict';
const {
  Model
} = require('sequelize');
const { dateFormatter, urlFormatter } = require('../helpers/index');
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `First name is required`
        },
        notEmpty: {
          msg: `First name is required`
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Last name is required`
        },
        notEmpty: {
          msg: `Last name is required`
        }
      }
    },    
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Gender is required`
        },
        notEmpty: {
          msg: `Gender is required`
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Date of birth is required`
        },
        notEmpty: {
          msg: `Date of birth is required`
        }
      }
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Phone number is required`
        },
        notEmpty: {
          msg: `Phone number is required`
        }
      }
    },  
    UserProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageProfileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};