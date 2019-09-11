const eventQueries = require("../db/queries.events.js");

module.exports = {
    index(req, res, next) {
        eventQueries.getAllEvents((err, events) => {

            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("events/index", { events });
            }
        })
    }
}