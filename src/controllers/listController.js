const listQueries = require("../db/queries.lists.js");
const Authorizer = require("../policies/list");

module.exports = {
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("lists/new", { eventId: req.params.eventId });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/lists");
    }
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
      let newList = {
        title: req.body.title,
        body: req.body.body,
        eventId: req.params.eventId,
        userId: req.user.id
      };

      listQueries.addList(newList, (err, list) => {
        if (err) {
          res.redirect(500, "/lists/new");
        } else {
          res.redirect(303, `/events/${newList.eventId}/lists/${list.id}`);
        }
      });
    } else {

      req.flash("notice", "You are not authorized to do that.");
      res.redirect(`/lists`);
    }

  },

  show(req, res, next) {
    listQueries.getList(req.params.id, (err, list) => {
      if (err || list == null) {
        res.redirect(404, "/");
      } else {
        res.render("lists/show", { list });
      }
    });
  },

  destroy(req, res, next) {
    listQueries.deleteList(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/events/${req.params.eventId}/lists/${req.params.id}`)
      } else {
        res.redirect(303, `/events/${req.params.eventId}`)
      }
    });
  },

  edit(req, res, next) {
    listQueries.getList(req.params.id, (err, list) => {
      if (err || list == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, list).edit();
        if (authorized) {
          res.render("lists/edit", { list });
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/events/${req.params.eventId}/lists/${req.params.id}`)
        }
      }
    });
  },

  update(req, res, next) {
    listQueries.updateList(req.params.id, req.body, (err, list) => {
      if (err || list == null) {
        res.redirect(404, `/events/${req.params.eventId}/lists/${req.params.id}/edit`);
      } else {
        res.redirect(`/events/${req.params.eventId}/lists/${req.params.id}`);
      }
    });
  }

}