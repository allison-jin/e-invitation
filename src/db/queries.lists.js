const List = require("./models").List;
const Event = require("./models").Event;
const Comment = require("./models").Comment;
const User = require("./models").User;
const Authorizer = require("../policies/list");

module.exports = {
    addList(newList, callback){
        return List.create(newList)
        .then((list) => {
          callback(null, list);
        })
        .catch((err) => {
          callback(err);
        })
    },

    getList(id, callback){
        return List.findById(id)
        .then((list) => {
          callback(null, list);
        })
        .catch((err) => {
          callback(err);
        })
    },

    deleteList(id, callback){
        return List.destroy({
          where: { id }
        })
        .then((deletedRecordsCount) => {
          callback(null, deletedRecordsCount);
        })
        .catch((err) => {
          callback(err);
        })
    },

    updateList(req, updatedList, callback){
        return List.findById(req.params.id)
        .then((list) => {

          if (!list) {
            return callback("List not found");
          }
  
          const authorized = new Authorizer(req.user, list).update();
  
          if (authorized) {
  
            list.update(updatedList, {
              fields: Object.keys(updatedList)
            })
              .then(() => {
                callback(null, list);
              })
              .catch((err) => {
                callback(err);
              })
          } else {
            req.flash("notice", "You are not authorized to do that.");
            callback("Forbidden");
          }
        });
    }

}