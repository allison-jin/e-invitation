const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController")
const validation = require("./validation");

router.get("/events", eventController.index);
router.get("/events/new", eventController.new);
router.post("/events/create", validation.validateEvents,eventController.create);
router.get("/events/:id", eventController.show);
router.post("/events/:id/destroy", eventController.destroy);
router.get("/events/:id/edit", eventController.edit);
router.post("/events/:id/update", validation.validateEvents,eventController.update);

module.exports = router;