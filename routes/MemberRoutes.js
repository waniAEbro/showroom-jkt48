const express = require("express");
const MemberController = require("../controllers/MemberController");

const router = express.Router();

router.get("/", MemberController.index);

router.get("/live/:id", MemberController.getLive);

router.get("/update", MemberController.updateDatabase);

router.get("/list", MemberController.list);

router.get("/:id", MemberController.show);

module.exports = router;