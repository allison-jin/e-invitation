const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/events";

const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("routes : lists", () => {

  beforeEach((done) => {
    this.event;
    this.list;
    this.user;

    sequelize.sync({ force: true }).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
        .then((user) => {
          this.user = user;

          Event.create({
            title: "Winter Games",
            description: "List your Winter Games stories.",
            userId: this.user.id,
            lists: [{
              title: "Snowball Fighting",
              body: "So much snow!",
              userId: this.user.id
            }]
          }, {
              include: {
                model: List,
                as: "lists"
              }
            })
            .then((event) => {
              this.event = event;
              this.list = event.lists[0];
              done();
            })
        })
    });

  });

  describe("guest user performing CRUD actions for List", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "guest"
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });


    describe("GET /events/:eventId/lists/:id", () => {

      it("should render a view with the selected list", (done) => {
        request.get(`${base}/${this.event.id}/lists/${this.list.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Snowball Fighting");
          done();
        });
      });

    });//guest-:id

  })//guest


  describe("admin user performing CRUD actions for List", () => {

    beforeEach((done) => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      })
        .then((user) => {
          request.get({         // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role,     // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
            (err, res, body) => {
              done();
            }
          );
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

    });//admin-new

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

      it("should not create a new list that fails validations", (done) => {
        const options = {
          url: `${base}/${this.event.id}/lists/create`,
          form: {

            //#1
            title: "a",
            body: "b"
          }
        };

        request.post(options,
          (err, res, body) => {

            //#2
            List.findOne({ where: { title: "a" } })
              .then((list) => {
                expect(list).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);list
                done();
              });
          }
        );
      });

    });//admin-create

    describe("GET /events/:eventId/lists/:id", () => {

      it("should render a view with the selected list", (done) => {
        request.get(`${base}/${this.event.id}/lists/${this.list.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Snowball Fighting");
          done();
        });
      });

    });//admin-:id

    describe("POST /events/:eventId/lists/:id/destroy", () => {

      it("should delete the list with the associated ID", (done) => {

        //#1
        expect(this.list.id).toBe(1);

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

    });//admin-destroy

    describe("GET /events/:eventId/lists/:id/edit", () => {

      it("should render a view with an edit list form", (done) => {
        request.get(`${base}/${this.event.id}/lists/${this.list.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit List");
          expect(body).toContain("Snowball Fighting");
          done();
        });
      });

    });//admin-edit

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
            title: "Snowball Fighting",
            body: "So much snow!"
          }
        };
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();

            List.findOne({
              where: { id: this.list.id }
            })
              .then((list) => {
                expect(list.title).toBe("Snowball Fighting");
                done();
              });
          });
      });

    });//admin-update
  })


  describe("member user performing CRUD actions for List", () => {


    beforeEach((done) => {  // before each suite in admin context
      User.create({
        email: "member@example.com",
        password: "123456",
        role: "member"
      }).then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        },
          (err, res, body) => {
            done();
          }
        );
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

    });//new

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
              .then((lisst) => {
                expect(lisst).not.toBeNull();
                expect(lisst.title).toBe("Watching snow melt");
                expect(lisst.body).toBe("Without a doubt my favoriting things to do besides watching paint dry!");
                expect(lisst.eventId).not.toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });

      it("should not create a new list that fails validations", (done) => {
        const options = {
          url: `${base}/${this.event.id}/lists/create`,
          form: {

            //#1
            title: "a",
            body: "b"
          }
        };

        request.post(options,
          (err, res, body) => {

            //#2
            List.findOne({ where: { title: "a" } })
              .then((list) => {
                expect(list).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });

    });//create

    describe("GET /events/:eventId/lists/:id", () => {

      it("should render a view with the selected list", (done) => {
        request.get(`${base}/${this.event.id}/lists/${this.list.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Snowball Fighting");
          done();
        });
      });

    });//:id

    describe("POST /events/:eventId/lists/:id/destroy", () => {

      it("should delete the list with the associated ID", (done) => {

        //#1
        expect(this.list.id).toBe(1);

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

    });//destroy

    describe("GET /events/:eventId/lists/:id/edit", () => {

      it("should not render a view with an edit list form", (done) => {
        request.get(`${base}/${this.event.id}/lists/${this.list.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          //expect(body).toContain("Edit List");
          expect(body).toContain("Snowball Fighting");
          done();
        });
      });

    });//edit
 
  });

});