'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'isAdmin', {
        allowNull: false,
        type: Sequelize.BOOLEAN
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'isAdmin')
  }
};
