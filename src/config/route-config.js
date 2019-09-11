module.exports = {
    init(app) {
        const staticRoutes = require("../routes/static");
        const eventRoutes = require("../routes/events");

        app.use(staticRoutes);
        app.use(eventRoutes);
    }
}