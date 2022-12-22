const express = require("express");
const WhatsappController = require("../controllers/WhatsappController");

const router = express.Router();

router.get("/", (req, res) => WhatsappController.index(req, res));

router.get("/create", (req, res) => WhatsappController.create(req, res));

router.get("/scan", (req, res) => WhatsappController.scan(req, res));

router.post("/", (req, res) => WhatsappController.store(req, res));

module.exports = router;