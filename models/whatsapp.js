const mongoose = require("mongoose");

const Whatsapp = mongoose.model("Whatsapp", {
    nomor: String
});

module.exports = Whatsapp