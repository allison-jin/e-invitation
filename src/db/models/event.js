'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.hasMany(models.Banner, {
      foreignKey: "eventId",
      as: "banners",
    });

    Event.hasMany(models.List, {
      foreignKey: "eventId",
      as: "lists"
    });
  };
  return Event;
};