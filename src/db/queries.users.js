const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Event = require("./models").Event;
const Comment = require("./models").Comment;

module.exports = {

  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    User.findById(id)
    .then((user) => {
      if(!user){
        callback(404);
      } else{
        callback(null, user);
        }
      })
      .catch((err) => {
        callback(err);
    });
  },

  upgrade(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User not found");
      } else{
        user.update({role: "premium"})
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        })
      }
    });
    },
    
    downgrade(id, callback){
      return User.findById(id)
      .then((user) => {
        if(!user){
          return callback("User not found");
        } else{
          user.update
          ({role: "member"})
          return Event.all()
          .then((events) => {
            events.forEach((event) => {
              if(event.private == true){
                event.update({ private: false })
              }
            })
          })
          .then(() => {
            callback(null, user);
          })
          .catch((err) => {
            callback(err);
          })
        }
      });
    }

}