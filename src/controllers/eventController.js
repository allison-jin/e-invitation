const eventQueries = require("../db/queries.events.js");
const Authorizer = require("../policies/event");

module.exports = {
    index(req, res, next) {
        eventQueries.getAllEvents((err, events) => {

            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("events/index", { events });
            }
        })
    },

    new(req, res, next) {
        const authorized = new Authorizer(req.user).new();

        if (authorized) {
            res.render("events/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/events");
        }

    },

    create(req, res, next) {
        const authorized = new Authorizer(req.user).create();

        let newEvent = {
            title: req.body.title,
            description: req.body.description,
            private: req.body.private,
            userId: req.user.id
        };
        eventQueries.addEvent(newEvent, (err, event) => {
            console.log(err);
            if (err) {
                res.redirect(500, "/events");
            } else {
                res.redirect(303, `/events/${event.id}`);
            }
        });
    },

    show(req, res, next) {

        eventQueries.getEvent(req.params.id, (err, event) => {
            if (err || event == null) {
                res.redirect(404, "/");
            } else {
                res.render("events/show", { event });
            }
        });
    },

    destroy(req, res, next) {
        eventQueries.deleteEvent(req.params.id, (err, event) => {
            if (err) {
                res.redirect(500, `/events/${req.params.id}`)
            } else {
                res.redirect(303, "/events")
            }
        });
    },

    edit(req, res, next) {

        eventQueries.getEvent(req.params.id, (err, event) => {
            if (err || event == null) {
                res.redirect(404, "/");
            } else {

                const authorized = new Authorizer(req.user, event).edit();

                if (authorized) {
                    res.render("events/edit", { event });
                } else {
                    req.flash("You are not authorized to do that.")
                    res.redirect(`/events/${req.params.id}`)
                }
            }
        });
    },

    update(req, res, next) {

        eventQueries.updateEvent(req, req.body, (err, event) => {
            if (err || event == null) {
                res.redirect(404, `/events/${req.params.id}/edit`);
            } else {
                res.redirect(`/events/${req.params.id}`);
            }
        });
    },

    privateIndex(req, res, next) {
   
        eventQueries.getAllEvents((err, events) => {
          console.log(events);
          if (err) {
            res.redirect(500, "static/index");
          } else {
            res.render("events/private", { events });
          }
        });
    }

}
