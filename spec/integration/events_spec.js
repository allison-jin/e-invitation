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

});