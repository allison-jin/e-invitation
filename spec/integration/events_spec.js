const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/events/";
const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;

describe("routes : events", () => {

    beforeEach((done) => {
        this.event;
        sequelize.sync({ force: true }).then((res) => {

            Event.create({
                title: "JS Frameworks",
                description: "There is a lot of them"
            })
                .then((event) => {
                    this.event = event;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });

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
    });

    describe("GET /events/new", () => {

        it("should render a new event form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Event");
                done();
            });
        });

    });

    describe("POST /events/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "blink-182 songs",
                description: "What's your favorite blink-182 song?"
            }
        };

        it("should create a new event and redirect", (done) => {

            request.post(options,

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

                title: "a",
                body: "b"
              }
            };
      
            request.post(options,
              (err, res, body) => {

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

    });

    describe("GET /events/:id", () => {

        it("should render a view with the selected event", (done) => {
            request.get(`${base}${this.event.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("JS Frameworks");
                done();
            });
        });

    });

    describe("POST /events/:id/destroy", () => {

        it("should delete the event with the associated ID", (done) => {

            Event.all()
                .then((events) => {

                    const eventCountBeforeDelete = events.length;

                    expect(eventCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.event.id}/destroy`, (err, res, body) => {
                        Event.findAll()
                            .then((events) => {
                                expect(err).toBeNull();
                                expect(events.length).toBe(eventCountBeforeDelete - 1);
                                done();
                            })

                    });
                });

        });

    });

    describe("GET /events/:id/edit", () => {

        it("should render a view with an edit event form", (done) => {
            request.get(`${base}${this.event.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Event");
                expect(body).toContain("JS Frameworks");
                done();
            });
        });

    });

    describe("POST /events/:id/update", () => {

        it("should update the event with the given values", (done) => {
            const options = {
                url: `${base}${this.event.id}/update`,
                form: {
                    title: "JavaScript Frameworks",
                    description: "There are a lot of them"
                }
            };

            request.post(options,
                (err, res, body) => {

                    expect(err).toBeNull();

                    Event.findOne({
                        where: { id: this.event.id }
                    })
                        .then((event) => {
                            expect(event.title).toBe("JavaScript Frameworks");
                            done();
                        });
                });
        });

    });

});