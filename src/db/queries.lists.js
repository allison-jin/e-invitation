const List = require("./models").List;
const Event = require("./models").Event;

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

    updateList(id, updatedList, callback){
        return List.findById(id)
        .then((list) => {
          if(!list){
            return callback("List not found");
          }
   
          list.update(updatedList, {
            fields: Object.keys(updatedList)
          })
          .then(() => {
            callback(null, list);
          })
          .catch((err) => {
            callback(err);
          });
        });
    }

}