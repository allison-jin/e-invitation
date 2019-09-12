'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      body: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      eventId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE", // delete list if parent event is deleted
        allowNull: false,    // validation to prevent null value
        references: {        // association information
          model: "Events",   // table name
          key: "id",         // attribute to use
          as: "eventId"      // reference as eventId
        },
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Lists');
  }
};