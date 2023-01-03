const express = require("express");
const WhatsappController = require("../controllers/WhatsappController");

const router = express.Router();

router.get("/", WhatsappController.index);

router.get("/create", WhatsappController.create);

router.get("/scan", WhatsappController.scan);

router.post("/", WhatsappController.store);

module.exports = router;