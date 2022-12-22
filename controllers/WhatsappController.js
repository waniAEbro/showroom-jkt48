const Whatsapp = require("../models/whatsapp.js");

const index = (req, res) => {
    Whatsapp.find().then(whatsapps => {
        res.render("whatsapp/index.ejs", { layout: "layouts/main.ejs", title: "Whatsapp", whatsapps });
    })
}

const scan = (req, res) => {
    res.render("whatsapp/scan.ejs", { layout: "layouts/main.ejs", title: "Scan Whatsapp" });
}

const create = (req, res) => {
    res.render("whatsapp/create.ejs", { layout: "layouts/main.ejs", title: "Create Whatsapp" });
}

const store = (req, res) => {
    let nomor = undefined;
    if (req.body.nomor[0] == 0) {
        nomor = req.body.nomor.replace("0", "62") + "@c.us";
    }
    const whatsapp = new Whatsapp({
        nomor: nomor
    });

    whatsapp.save().then(() => {
        res.redirect("/whatsapp");
    }).catch(err => {
        res.status(400).send("unable to save to database");
    });
}

module.exports = {
    create, store, scan, index
}