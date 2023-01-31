const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.get("/", UserController.index);

router.get("/edit/:id", UserController.edit);

router.put("/:id", UserController.update);

module.exports = router;