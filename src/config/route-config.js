module.exports = {
    init(app) {
        const staticRoutes = require("../routes/static");
        const eventRoutes = require("../routes/events");
        const listRoutes = require("../routes/lists");

        app.use(staticRoutes);
        app.use(eventRoutes);
        app.use(listRoutes);
    }
}