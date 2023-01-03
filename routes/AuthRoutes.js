const express = require('express');
const AuthController = require("../controllers/AuthController.js");

const router = express.Router();

router.get("/signup", AuthController.showSignUp);

router.post("/signup", AuthController.storeSignUp);

router.get("/login", AuthController.showLogin);

router.post("/login", AuthController.checkLogin);

module.exports = router;