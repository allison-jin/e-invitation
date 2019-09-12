const listQueries = require("../db/queries.lists.js");

module.exports = {
    new(req, res, next){
        res.render("lists/new", {eventId: req.params.eventId});
    },

    create(req, res, next){
        let newList= {
          title: req.body.title,
          body: req.body.body,
          eventId: req.params.eventId
        };
        listQueries.addList(newList, (err, list) => {
          if(err){
            res.redirect(500, "/lists/new");
          } else {
            res.redirect(303, `/events/${newList.eventId}/lists/${list.id}`);
          }
        });
      },

      show(req, res, next){
        listQueries.getList(req.params.id, (err, list) => {
          if(err || list == null){
            res.redirect(404, "/");
          } else {
            res.render("lists/show", {list});
          }
        });
      },

      destroy(req, res, next){
        listQueries.deleteList(req.params.id, (err, deletedRecordsCount) => {
          if(err){
            res.redirect(500, `/events/${req.params.eventId}/lists/${req.params.id}`)
          } else {
            res.redirect(303, `/events/${req.params.eventId}`)
          }
        });
      },

      edit(req, res, next){
        listQueries.getList(req.params.id, (err, list) => {
          if(err || list == null){
            res.redirect(404, "/");
          } else {
            res.render("lists/edit", {list});
          }
        });
      },

      update(req, res, next){
        listQueries.updateList(req.params.id, req.body, (err, list) => {
          if(err || list == null){
            res.redirect(404, `/events/${req.params.eventId}/lists/${req.params.id}/edit`);
          } else {
            res.redirect(`/events/${req.params.eventId}/lists/${req.params.id}`);
          }
        });
      }

}