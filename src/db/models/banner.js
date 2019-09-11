'use strict';
module.exports = (sequelize, DataTypes) => {
  var Banner = sequelize.define('Banner', {
    source: DataTypes.STRING,
    description: DataTypes.STRING,
    eventId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Events",
        key: "id",
        as: "eventId",
      }
    }
  }, {});
  Banner.associate = function(models) {
    // associations can be defined here
    Banner.belongsTo(models.Event, {
      foreignKey: "eventId",
      onDelete: "CASCADE",
    });
  };
  return Banner;
};