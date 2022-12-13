const express = require("express");
const MemberController = require("../controllers/MemberController");

const router = express.Router();

router.get("/", (req, res) => MemberController.index(req, res));

router.get("/live/:id", (req, res) => MemberController.getLive(req, res));

router.get("/update", (req, res) => MemberController.updateDatabase(req, res));

router.get("/:id", (req, res) => MemberController.show(req, res));

module.exports = router;