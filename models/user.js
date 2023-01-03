const mongoose = require("mongoose");

const User = mongoose.model("User", {
    nama: String,
    password: String
});

module.exports = User;