const express = require("express");
const MemberController = require("../controllers/MemberController");

const router = express.Router();

router.get("/", MemberController.index);

router.post("/", MemberController.store);

router.get("/live/:id", MemberController.getLive);

router.get("/list", MemberController.list);

router.delete("/:id", MemberController.destroy);

router.get("/:id", MemberController.show);

module.exports = router;