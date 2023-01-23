const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
    let errors = { email: "", password: "", nama: "" };

    if (err.code === 11000) {
        errors.email = "email sudah pernah digunakan";
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(error => {
            errors[`${error.properties.path}`] = error.properties.message;
        });
    }
    return errors;
}

const showSignUp = (req, res) => {
    res.render("auth/signup", { layout: "layouts/main", title: "SignUp" });
}

const maxAge = 3 * 60 * 60 * 24;

const createToken = (id) => {
    return jwt.sign({ id }, "iwan secret", { expiresIn: maxAge })
}

const storeSignUp = async (req, res) => {
    const { nama, email, password } = req.body;
    try {
        const user = await User.create({ nama, email, password });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

const showLogin = (req, res) => {
    res.render("auth/login", { layout: "layouts/main", title: "Login" });
}

const checkLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const logOut = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
}

module.exports = {
    showSignUp, showLogin, storeSignUp, checkLogin, logOut
}