const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/events/";
const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const User = require("../../src/db/models").User;

describe("routes : events", () => {
  beforeEach((done) => {
    this.event;
    this.user;

    sequelize.sync({ force: true }).then((res) => {

      User.create({
        name: "Selena",
        email: "user@example.com",
        password: "123456789"
      })
        .then((user) => {
          this.user = user;
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role,
              userId: user.id,
              email: user.email
            }

          });

          Event.create({
            title: "JS Frameworks",
            description: "There is a lot of them",
            private: false,
            userId: this.user.id
          })
            .then((event) => {
              this.event = event;
              done();
            })
            .catch((err) => {

              done();
            });

        });

    });
  });

  describe("admin user performing CRUD actions for event", () => {
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
              role: user.role,  // mock authenticate as admin user
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

    describe("GET /events", () => {

      it("should return a status code 200 and all events", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Events");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });// events

    describe("GET /events/new", () => {

      it("should render a new event form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Event");
          done();
        });
      });

    });//new

    describe("POST /events/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?"
        }
      };

      it("should create a new event and redirect", (done) => {

        //#1
        request.post(options,

          //#2
          (err, res, body) => {
            Event.findOne({ where: { title: "blink-182 songs" } })
              .then((event) => {
                expect(res.statusCode).toBe(303);
                expect(event.title).toBe("blink-182 songs");
                expect(event.description).toBe("What's your favorite blink-182 song?");
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });

      it("should not create a new post that fails validations", (done) => {
        const options = {
          url: `${base}create`,
          form: {

            //#1
            title: "a",
            body: "b"
          }
        };

        request.post(options,
          (err, res, body) => {

            //#2
            Event.findOne({ where: { title: "a" } })
              .then((event) => {
                expect(event).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });

    });// create

    describe("GET /events/:id", () => {

      it("should render a view with the selected event", (done) => {
        request.get(`${base}${this.event.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });//events/:id


    describe("POST /events/:id/destroy", () => {

      it("should delete the event with the associated ID", (done) => {

        //#1
        Event.all()
          .then((events) => {

            //#2
            const eventCountBeforeDelete = events.length;

            expect(eventCountBeforeDelete).toBe(1);

            //#3
            request.post(`${base}${this.event.id}/destroy`, (err, res, body) => {
              Event.all()
                .then((events) => {
                  expect(err).toBeNull();
                  expect(events.length).toBe(eventCountBeforeDelete - 1);
                  done();
                })

            });
          });

      });

    });//:id/destroy

    describe("GET /events/:id/edit", () => {

      it("should render a view with an edit event form", (done) => {
        request.get(`${base}${this.event.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Event");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });//:id/edit


    describe("POST /events/:id/update", () => {

      it("should update the event with the given values", (done) => {
        const options = {
          url: `${base}${this.event.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            description: "There are a lot of them",
            userId: this.user.id
          }
        };
        //#1
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            //#2
            Event.findOne({
              where: { id: this.event.id }
            })
              .then((event) => {
                expect(event.title).toBe("JavaScript Frameworks");
                done();
              });
          });
      });

    });//:id/update
  })//admin

  describe("member user performing CRUD actions for event from other user", () => {

    beforeEach((done) => {
      User.create({
        email: "member2@example.com",
        password: "123456",
        role: "member"
      })
        .then((user) => {
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              userId: user.id,
              role: "member"
            }
          },
            (err, res, body) => {
              done();
            }
          );
        }

        )

    });

    describe("POST /events/:id/destroy", () => {

      it("should not delete the event with the associated ID", (done) => {

        //#1
        Event.all()
          .then((events) => {

            //#2
            const eventCountBeforeDelete = events.length;

            expect(eventCountBeforeDelete).toBe(1);

            //#3
            request.post(`${base}${this.event.id}/destroy`, (err, res, body) => {
              Event.all()
                .then((events) => {

                  expect(events.length).toBe(eventCountBeforeDelete);
                  done();
                })

            });
          });

      });

    });


  });
  describe("member user performing CRUD actions for event", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: this.user.id,
          role: "member"
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("GET /events", () => {

      it("should respond with all events", (done) => {
        request.get(base, (err, res, body) => {

          expect(err).toBeNull();
          expect(body).toContain("Events");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });// member-events

    describe("GET /events/new", () => {

      it("should render a new event form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Event");
          done();
        });
      });

    });//member-new

    describe("POST /events/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?"
        }
      };

      it("should create a new event and redirect", (done) => {

        //#1
        request.post(options,

          //#2
          (err, res, body) => {
            Event.findOne({ where: { title: "blink-182 songs" } })
              .then((event) => {
                expect(res.statusCode).toBe(303);
                expect(event.title).toBe("blink-182 songs");
                expect(event.description).toBe("What's your favorite blink-182 song?");
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
          url: `${base}create`,
          form: {

            //#1
            title: "a",
            body: "b"
          }
        };

        request.post(options,
          (err, res, body) => {

            //#2
            Event.findOne({ where: { title: "a" } })
              .then((event) => {
                expect(event).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });

    });// member-create

    describe("GET /events/:id", () => {

      it("should render a view with the selected event", (done) => {
        request.get(`${base}${this.event.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });//member-events/:id


    describe("POST /events/:id/destroy", () => {

      it("should delete the event with the associated ID", (done) => {

        //#1
        Event.all()
          .then((events) => {

            //#2
            const eventCountBeforeDelete = events.length;

            expect(eventCountBeforeDelete).toBe(1);

            //#3
            request.post(`${base}${this.event.id}/destroy`, (err, res, body) => {
              Event.all()
                .then((events) => {

                  expect(events.length).toBe(eventCountBeforeDelete - 1);
                  done();
                })

            });
          });

      });

    });//member-:id/destroy

    describe("GET /events/:id/edit", () => {

      it("should render a view with an edit event form", (done) => {
        request.get(`${base}${this.event.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Event");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });//member-:id/edit


    describe("POST /events/:id/update", () => {

      it("should update the event with the given values", (done) => {
        const options = {
          url: `${base}${this.event.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            description: "There are a lot of them"
          }
        };
        //#1
        request.post(options,
          (err, res, body) => {

            expect(err).toBeNull();
            //#2
            Event.findOne({
              where: { id: this.event.id }
            })
              .then((event) => {
                expect(event.title).toBe("JavaScript Frameworks");
                done();
              });
          });
      });

    });//member-:id/update

  });//member

});
