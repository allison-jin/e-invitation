const express = require("express");
const router = express.Router();

const listController = require("../controllers/listController")
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/events/:eventId/lists/new", listController.new);
router.get("/events/:eventId/lists/:id/edit", listController.edit);
router.get("/events/:eventId/lists/:id", listController.show);

router.post("/events/:eventId/lists/create", 
    helper.ensureAuthenticated, 
    validation.validateLists, 
    listController.create);

router.post("/events/:eventId/lists/:id/destroy", listController.destroy);
router.post("/events/:eventId/lists/:id/update", validation.validateLists, listController.update);

module.exports = router;