const User = require("../models/user");

const index = (req, res) => {
    User.find()
        .then(users => {
            res.render("users/index", { layout: "layouts/main", title: "Users", users })
        })
        .catch(error => {
            console.log(error);
        })
}

const edit = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            res.render("users/edit", { layout: "layouts/main", title: "Edit User", user })
        })
        .catch(error => {
            console.log(error);
        })
}

const update = (req, res) => {
    console.log(req.body);
    User.updateOne({ _id: req.body.id }, { info: { whatsapp: req.body.whatsapp } })
        .then(user => {
            res.status(200).redirect("/user");
        })
        .catch(error => {
            console.log(error);
        })
}

module.exports = {
    index, edit, update
}