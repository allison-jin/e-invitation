const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/events/";

const sequelize = require("../../src/db/models/index").sequelize;
const Event = require("../../src/db/models").Event;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

    beforeEach((done) => {

        // #2
        this.user;
        this.event;
        this.comment;

        sequelize.sync({ force: true }).then((res) => {

            // #3
            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
                .then((user) => {
                    this.user = user;  // store user

                    Event.create({
                        title: "Expeditions to Alpha Centauri",
                        description: "A compilation of reports from recent visits to the star system.",
                        userId: this.user.id
                    })
                        .then((event) => {
                            this.event = event;  // store event

                            Comment.create({
                                body: "ay caramba!!!!!",
                                userId: this.user.id,
                                eventId: this.event.id
                            })
                                .then((coment) => {
                                    this.comment = coment;             // store comment
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

    describe("guest attempting to perform CRUD actions for Comment", () => {

        beforeEach((done) => {    // before each suite in this context
            request.get({           // mock authentication
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0 // flag to indicate mock auth to destroy any session
                }
            },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("POST /events/:eventId/comments/create", () => {

            it("should not create a new comment", (done) => {
                const options = {
                    url: `${base}${this.event.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!"
                    }
                };
                request.post(options,
                    (err, res, body) => {

                        Comment.findOne({ where: { body: "This comment is amazing!" } })
                            .then((comment) => {
                                expect(comment).toBeNull();   // ensure no comment was created
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

        describe("POST /events/:eventId/comments/:id/destroy", () => {

            it("should not delete the comment with the associated ID", (done) => {
                Comment.all()
                    .then((comments) => {
                        const commentCountBeforeDelete = comments.length;

                        expect(commentCountBeforeDelete).toBe(1);

                        request.post(
                            `${base}${this.event.id}/comments/${this.comment.id}/destroy`,
                            (err, res, body) => {
                                Comment.findAll()
                                    .then((comments) => {
                                        expect(err).toBeNull();
                                        expect(comments.length).toBe(commentCountBeforeDelete);
                                        done();
                                    })

                            });
                    })
            });
        });

    });// guest


    describe("signed in user performing CRUD actions for Comment", () => {

        beforeEach((done) => {    // before each suite in this context
            request.get({           // mock authentication
                url: "http://localhost:3000/auth/fake",
                form: {
                    role: "member",     // mock authenticate as member user
                    userId: this.user.id
                }
            },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("POST /eventcs/:eventId/comments/create", () => {

            it("should create a new comment and redirect", (done) => {
                const options = {
                    url: `${base}${this.event.id}/comments/create`,
                    form: {
                        body: "This comment is amazing!" 
                    }
                };
                request.post(options,
                    (err, res, body) => {
                        Comment.findOne({ where: { body: "This comment is amazing!" } })
                            .then((comment) => {
                                expect(comment).not.toBeNull();
                                expect(comment.body).toBe("This comment is amazing!");
                                expect(comment.id).not.toBeNull();
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

        // #3
        describe("POST /events/:eventId/comments/:id/destroy", () => {

            it("should delete the comment with the associated ID", (done) => {
                Comment.findAll()
                    .then((comments) => {
                        const commentCountBeforeDelete = comments.length;

                        expect(commentCountBeforeDelete).toBe(1);

                        request.post(
                            `${base}${this.event.id}/comments/${this.comment.id}/destroy`,
                            (err, res, body) => {
                                expect(res.statusCode).toBe(302);
                                Comment.findAll()
                                    .then((comments) => {
                                        expect(err).toBeNull();
                                        expect(comments.length).toBe(commentCountBeforeDelete - 1);
                                        done();
                                    })

                            });
                    })

            });

        });
    });// member


});