const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/events";

const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const List = require("../../src/db/models").List;

describe("routes : lists", () => {

  beforeEach((done) => {
    this.event;
    this.list;

    sequelize.sync({ force: true }).then((res) => {

      //#1
      Event.create({
        title: "Winter Games",
        description: "List your Winter Games stories."
      })
        .then((event) => {
          this.event = event;

          List.create({
            title: "Snowball Fighting",
            body: "So much snow!",
            eventId: this.event.id
          })
            .then((list) => {
              this.list = list;
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });

  });

  describe("GET /events/:eventId/lists/new", () => {

    it("should render a new list form", (done) => {
      request.get(`${base}/${this.event.id}/lists/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New List");
        done();
      });
    });

  });

  describe("POST /events/:eventId/lists/create", () => {

    it("should create a new list and redirect", (done) => {
      const options = {
        url: `${base}/${this.event.id}/lists/create`,
        form: {
          title: "Watching snow melt",
          body: "Without a doubt my favoriting things to do besides watching paint dry!"
        }
      };
      request.post(options,
        (err, res, body) => {

          List.findOne({ where: { title: "Watching snow melt" } })
            .then((list) => {
              expect(list).not.toBeNull();
              expect(list.title).toBe("Watching snow melt");
              expect(list.body).toBe("Without a doubt my favoriting things to do besides watching paint dry!");
              expect(list.eventId).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

  });

  describe("GET /events/:eventId/lists/:id", () => {

    it("should render a view with the selected list", (done) => {
      request.get(`${base}/${this.event.id}/lists/${this.list.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });

  });

  describe("POST /events/:eventId/lists/:id/destroy", () => {

    it("should delete the list with the associated ID", (done) => {

      Event.all()
        .then((events) => {

          //#2
          const eventCountBeforeDelete = events.length;

          expect(eventCountBeforeDelete).toBe(1);

          request.post(`${base}/${this.event.id}/lists/${this.list.id}/destroy`, (err, res, body) => {

            //#2
            List.findById(1)
              .then((list) => {
                expect(err).toBeNull();
                expect(list).toBeNull();
                done();
              })
          });

        });

    });

  });

  describe("GET /events/:eventId/lists/:id/edit", () => {

    it("should render a view with an edit list form", (done) => {
      request.get(`${base}/${this.event.id}/lists/${this.list.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit List");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });

  });

  describe("POST /events/:eventId/lists/:id/update", () => {

    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.event.id}/lists/${this.list.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly."
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the list with the given values", (done) => {
      const options = {
        url: `${base}/${this.event.id}/lists/${this.list.id}/update`,
        form: {
          title: "Snowman Building Competition"
        }
      };
      request.post(options,
        (err, res, body) => {

          expect(err).toBeNull();

          List.findOne({
            where: { id: this.list.id }
          })
            .then((list) => {
              expect(list.title).toBe("Snowman Building Competition");
              done();
            });
        });
    });

  });

});