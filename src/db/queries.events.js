const Event = require("./models").Event;
const List = require("./models").List;
const Authorizer = require("../policies/event");
const Comment = require("./models").Comment;
const User = require("./models").User;

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
    return Event.create(newEvent)
      .then(event => {
        callback(null, event);
      })
      .catch((err) => {
        callback(err);
      });
  },

  getEvent(id, callback) {
    return Event.findById(id, {

      include: [{ model: List, as: "lists" },
      {
        model: Comment, as: "comments", include: [{ model: User }]
      }]

    })

      .then((event) => {
        callback(null, event);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteEvent(req, callback) {

    return Event.findById(req.params.id)
      .then((event) => {

        const authorized = new Authorizer(req.user, event).destroy();

        if (authorized) {

          event.destroy()
            .then((res) => {
              callback(null, event);
            });

        } else {

          req.flash("notice", "You are not authorized to do that.")
          callback(401);
        }
      })
      .catch((err) => {
        callback(err);
      });
  },

  updateEvent(req, updatedEvent, callback) {

    return Event.findById(req.params.id)
      .then((event) => {

        if (!event) {
          return callback("Event not found");
        }

        const authorized = new Authorizer(req.user, event).update();

        if (authorized) {

          event.update(updatedEvent, {
            fields: Object.keys(updatedEvent)
          })
            .then(() => {
              callback(null, event);
            })
            .catch((err) => {
              callback(err);
            });
        } else {

          req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
        }
      });
  },

  privateToPublic(id) {
    return Event.findAll()
      .then((events) => {
        events.forEach((event) => {
          if (event.userId == id && event.private == true) {
            event.update({
              private: false
            })
          }
        })
      })
      .catch((err) => {

        callback(err);
      })
  }

}