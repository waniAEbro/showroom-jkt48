const Member = require("../models/member");
const https = require("https");

const index = (req, res) => {
    Member.find().then(members => {
        res.render("index", { layout: "layouts/main", title: "Home", members });
    });
};

const show = (req, res) => {
    Member.findOne({ _id: req.params.id })
        .then(member => {
            res.render("detail", { layout: "layouts/main", title: "Detail", member });
        })
        .catch(error => {
            res.status(404).render("404", { layout: "layouts/main", title: "404" });
        });
};

const getLive = (req, res) => {
    https.get("https://www.showroom-live.com/api/live/streaming_url?room_id=" + req.params.id, (response) => {
        let respond = "";
        response.on("data", data => {
            respond += data;
        })

        response.on("end", () => {
            res.send(JSON.parse(respond));
        })
    }).on("error", error => {
        console.log(error);
    });
};

const updateDatabase = (req, res) => {
    res.status(404).render("404", { layout: "layouts/main", title: "404" });
};

module.exports = {
    index, show, getLive, updateDatabase
};