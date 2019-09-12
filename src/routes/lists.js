const express = require("express");
const router = express.Router();

const listController = require("../controllers/listController")

router.get("/events/:eventId/lists/new", listController.new);
router.post("/events/:eventId/lists/create", listController.create);
router.get("/events/:eventId/lists/:id", listController.show);
router.post("/events/:eventId/lists/:id/destroy", listController.destroy);
router.get("/events/:eventId/lists/:id/edit", listController.edit);
router.post("/events/:eventId/lists/:id/update", listController.update);

module.exports = router;