'use strict';
const fs = require('fs')

module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync('./data/admins.json', 'utf-8')).map(el => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    await queryInterface.bulkInsert('Admins', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {})
  }
};
