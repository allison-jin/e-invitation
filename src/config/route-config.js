module.exports = {
    init(app) {
        const staticRoutes = require("../routes/static");
        const eventRoutes = require("../routes/events");
        const listRoutes = require("../routes/lists");
        const userRoutes = require("../routes/users");
        const commentRoutes = require("../routes/comments");

        if(process.env.NODE_ENV === "test") {
            const mockAuth = require("../../spec/support/mock-auth.js");
            mockAuth.fakeIt(app);
        }

        app.use(staticRoutes);
        app.use(eventRoutes);
        app.use(listRoutes);
        app.use(userRoutes);
        app.use(commentRoutes);
    }
}