'use strict';
const fs = require('fs')

module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8')).map(el => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
        isSuspended: false,
        isAdmin: false
      }
    })
    await queryInterface.bulkInsert('Users', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
