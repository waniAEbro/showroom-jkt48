const mongoose = require("mongoose");

const Member = mongoose.model("Member", {
    info: Object,
    is_notified: Boolean
})

module.exports = Member;
