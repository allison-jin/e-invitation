'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.hasMany(models.Banner, {
      foreignKey: "eventId",
      as: "banners",
    });
  };
  return Event;
};