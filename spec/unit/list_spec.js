const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("List", () => {

  beforeEach((done) => {
    this.event;
    this.list;
    this.user;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; //store the user

        Event.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          userId: this.user.id,
          lists: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: {
            model: List,
            as: "lists"
          }
        })
        .then((event) => {
          this.event = event; //store the event
          this.list = event.lists[0]; //store the list
          done();
        })
      })
    });

  });

  describe("#create()", () => {

    it("should create a list object with a title, body, and assigned event", (done) => {

      List.create({
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question.",
        eventId: this.event.id,
        userId: this.user.id
      })
      .then((list) => {

        expect(list.title).toBe("Pros of Cryosleep during the long journey");
        expect(list.body).toBe("1. Not having to answer the 'are we there yet?' question.");
        expect(list.eventId).toBe(this.event.id);
        expect(list.userId).toBe(this.user.id);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a list with missing title, body, or assigned event", (done) => {
        List.create({
          title: "Pros of Cryosleep during the long journey"
        })
        .then((list) => {
          done();
   
        })
        .catch((err) => {
   
          expect(err.message).toContain("List.body cannot be null");
          expect(err.message).toContain("List.eventId cannot be null");
          done();
   
        })
      });

  });


  describe("#setEvent()", () => {

    it("should associate a event and a list together", (done) => {

      Event.create({
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible",
        userId: this.user.id
      })
      .then((newEvent) => {

        expect(this.list.eventId).toBe(this.event.id);

        this.list.setEvent(newEvent)
        .then((list) => {

          expect(list.eventId).toBe(newEvent.id);
          done();

        });
      })
    });

  });

  describe("#getEvent()", () => {

    it("should return the associated event", (done) => {

      this.list.getEvent()
      .then((associatedEvent) => {
        expect(associatedEvent.title).toBe("Expeditions to Alpha Centauri");
        done();
      });

    });

  });

  describe("#setUser()", () => {

    it("should associate a list and a user together", (done) => {

      User.create({
        email: "ada@example.com",
        password: "password"
      })
      .then((newUser) => {

        expect(this.list.userId).toBe(this.user.id);

        this.list.setUser(newUser)
        .then((list) => {

          expect(this.list.userId).toBe(newUser.id);
          done();

        });
      })
    });

  });//setUser

  describe("#getUser()", () => {

    it("should return the associated event", (done) => {

      this.list.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });

    });

  });//getUser

});