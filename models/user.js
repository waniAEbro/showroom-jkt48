const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, "silakan masukkan nama"]
    },
    password: {
        type: String,
        required: [true, "silakan masukkan password"],
        minlength: [6, "password harus lebih dari atau sama dengan 6 digit"]
    },
    email: {
        type: String,
        required: [true, "Silakan masukkan email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "silakan masukkan email yang valid"]
    }
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password or incorrect email!");
    }
    throw Error("incorrect password or incorrect email!");
};

const User = mongoose.model("user", userSchema);

module.exports = User;