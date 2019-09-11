const Event = require("./models").Event;

module.exports = {

//#1
  getAllEvents(callback){
    return Event.findAll()

//#2
    .then((events) => {
      callback(null, events);
    })
    .catch((err) => {
      callback(err);
    })
  }
}