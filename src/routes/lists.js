const express = require("express");
const router = express.Router();

const listController = require("../controllers/listController")
const validation = require("./validation");

router.get("/events/:eventId/lists/new", listController.new);
router.post("/events/:eventId/lists/create", validation.validateLists, listController.create);
router.get("/events/:eventId/lists/:id", listController.show);
router.post("/events/:eventId/lists/:id/destroy", listController.destroy);
router.get("/events/:eventId/lists/:id/edit", listController.edit);
router.post("/events/:eventId/lists/:id/update", validation.validateLists, listController.update);

module.exports = router;