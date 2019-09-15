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
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
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

    Event.hasMany(models.Comment, {
      foreignKey: "eventId",
      as: "comments"
    });

    Event.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

  };
  return Event;
};