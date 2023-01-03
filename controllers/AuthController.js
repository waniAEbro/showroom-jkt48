const showSignUp = (req, res) => {
    res.render("auth/signup", { layout: "layouts/main", title: "SignUp" });
}

const storeSignUp = (req, res) => {
    res.send("anda signup");
}

const showLogin = (req, res) => {
    res.render("auth/login", { layout: "layouts/main", title: "Login" });
}

const checkLogin = (req, res) => {
    res.send("anda lolgin")
}

module.exports = {
    showSignUp, showLogin, storeSignUp, checkLogin
}