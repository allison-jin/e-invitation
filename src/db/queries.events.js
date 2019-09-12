const Event = require("./models").Event;
const List = require("./models").List;

module.exports = {

  getAllEvents(callback) {
    return Event.all()

      .then((events) => {
        callback(null, events);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addEvent(newEvent, callback) {
    return Event.create({
      title: newEvent.title,
      description: newEvent.description
    })
      .then((event) => {
        callback(null, event);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getEvent(id, callback) {
    return Event.findById(id, {

      include: [{
        model: List,
        as: "lists"
      }]
    })
      .then((event) => {
        callback(null, event);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteEvent(id, callback) {
    return Event.destroy({
      where: { id }
    })
      .then((event) => {
        callback(null, event);
      })
      .catch((err) => {
        callback(err);
      })
  },

  updateEvent(id, updatedEvent, callback) {
    return Event.findById(id)
      .then((event) => {
        if (!event) {
          return callback("Event not found");
        }

        event.update(updatedEvent, {
          fields: Object.keys(updatedEvent)
        })
          .then(() => {
            callback(null, event);
          })
          .catch((err) => {
            callback(err);
          });
      });
  }


}