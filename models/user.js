const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, "silakan masukkan password"],
        minlength: [6, "password harus lebih dari atau sama dengan 6 digit"]
    },
    username: {
        type: String,
        required: [true, "Silakan masukkan username"],
        unique: true,
        lowercase: true,
    },
    info: Object
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password or incorrect username!");
    }
    throw Error("incorrect password or incorrect username!");
};

const User = mongoose.model("user", userSchema);

module.exports = User;