const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("Event", () => {

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

        it("should create a event object with a title and description", (done) => {
            Event.create({
                title: "test tittle one",
                description: "description for tittle one",
                userId: this.user.id
            })
                .then((event) => {
                    expect(event.title).toBe("test tittle one");
                    expect(event.description).toBe("description for tittle one");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("#getLists()", () => {

        it("should return list objects that are associated with the event", (done) => {

            this.event.getLists()
                .then((associatedLists) => {
                    expect(associatedLists[0].title).toBe("My first visit to Proxima Centauri b");
                    done();
                });
        });
    });
});