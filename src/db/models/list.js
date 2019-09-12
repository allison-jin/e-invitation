'use strict';
module.exports = (sequelize, DataTypes) => {
  var List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  List.associate = function(models) {
    // associations can be defined here
    List.belongsTo(models.Event, {
      foreignKey: "eventId",
      onDelete: "CASCADE"
    });
  };
  return List;
};