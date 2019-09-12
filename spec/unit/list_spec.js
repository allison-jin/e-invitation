const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const List = require("../../src/db/models").List;

describe("List", () => {

  beforeEach((done) => {

    this.event;
    this.list;
    sequelize.sync({force: true}).then((res) => {

      Event.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((event) => {
        this.event = event;

        List.create({
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
          eventId: this.event.id
        })
        .then((list) => {
          this.list = list;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#create()", () => {

    it("should create a list object with a title, body, and assigned event", (done) => {

      List.create({
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question.",
        eventId: this.event.id
      })
      .then((list) => {

        expect(list.title).toBe("Pros of Cryosleep during the long journey");
        expect(list.body).toBe("1. Not having to answer the 'are we there yet?' question.");
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
        description: "1. The Wi-Fi is terrible"
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

});