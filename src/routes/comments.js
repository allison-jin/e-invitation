const express = require("express");
const router = express.Router();

 //#1
const commentController = require("../controllers/commentController");
const validation = require("./validation");

 // #2
router.post("/events/:eventId/comments/create", validation.validateComments,commentController.create);

 // #3
router.post("/events/:eventId/comments/:id/destroy", commentController.destroy);
module.exports = router;