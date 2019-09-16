const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("Comment", () => {

  beforeEach((done) => {
    this.event;
    this.comment;
    this.user;

    sequelize.sync({force: true}).then((res) => {


      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })     
      .then((user) => {
        this.user = user;

        Event.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          userId: this.user.id

        })
        .then((event) => {
          this.event = event;

          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            eventId: this.event.id
          })
          .then((comment) => {
            this.comment = comment;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });


  describe("#create()", () => {

    it("should create a comment object with a body, assigned event and user", (done) => {
      Comment.create({ // create a comment
        body: "The geological kind.",
        eventId: this.event.id,
        userId: this.user.id
      })
      .then((comment) => {// confirm it was created with the values passed
        expect(comment.body).toBe("The geological kind.");
        expect(comment.eventId).toBe(this.event.id);
        expect(comment.userId).toBe(this.user.id)
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a comment with missing body, assigned event or user", (done) => {
      Comment.create({
        body: "Are the inertial dampers still engaged?"
      })
      .then((comment) => {
        done();

      })
      .catch((err) => {

        expect(err.message).toContain("Comment.userId cannot be null");
        expect(err.message).toContain("Comment.eventId cannot be null");
        done();

      })
    });

  });


  describe("#setUser()", () => {

    it("should associate a comment and a user together", (done) => {

      User.create({               // create an unassociated user
        email: "bob@example.com",
        password: "password"
      })
      .then((newUser) => {

        expect(this.comment.userId).toBe(this.user.id);
       
        this.comment.setUser(newUser)// then reassign it
        .then((comment) => {

          expect(comment.userId).toBe(newUser.id);// confirm the values persisted
          done();

        });
      })
    });

  });


  describe("#getUser()", () => {

    it("should return the associated user", (done) => {

      this.comment.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });

    });

  });

  describe("#setEvent()", () => {

    it("should associate a event and a comment together", (done) => {

      Event.create({  
        title: "Dress code on Proxima b",
        description: "Spacesuit, space helmet, space boots, and space gloves",
        userId: this.user.id
      })
      .then((newEvent) => {

        expect(this.comment.eventId).toBe(this.event.id); 

        this.comment.setEvent(newEvent)                 
        .then((comment) => {

          expect(comment.eventId).toBe(newEvent.id);    
          done();

        });
      })
    });

  });

  describe("#getEvent()", () => {

    it("should return the associated event", (done) => {

      this.comment.getEvent()
      .then((associatedEvent) => {
        expect(associatedEvent.title).toBe("Expeditions to Alpha Centauri");
        done();
      });

    });

  });
});