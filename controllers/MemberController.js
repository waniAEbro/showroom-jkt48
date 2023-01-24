const Member = require("../models/member");
const https = require("https");

const index = (req, res) => {
    Member.find().then(members => {
        let lives = members.filter(member => member.info.is_onlive);
        res.render("member/index", { layout: "layouts/main", title: "Home", members, lives });
    }).catch(error => {
        console.log(error);
    });
};

const show = (req, res) => {
    Member.findOne({ _id: req.params.id })
        .then(member => {
            res.render("member/show", { layout: "layouts/main", title: "Detail", member });
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

const list = (req, res) => {
    Member.find()
        .then(members => {
            res.render("member/list", { layout: "layouts/main", title: "List", members })
        })
        .catch(error => {
            console.log(error);
        });
}

const destroy = (req, res) => {
    Member.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/member/list");
        })
        .catch(error => { console.log(error) });
}

const store = (req, res) => {
    https.get("https://www.showroom-live.com/api/room/profile?room_id=" + req.body.id, (response) => {
        let respond = "";

        response.on("data", data => {
            respond += data;
        })

        response.on("end", () => {
            if (!JSON.parse(respond).errors) {
                const member = new Member({
                    info: JSON.parse(respond),
                    is_notified: false
                })

                member.save();

                res.status(201).json({ message: "successful!", error: "" });
            } else {
                res.status(400).json({ message: "error!", error: JSON.parse(respond).errors[0] });
            }
        })
    }).on("error", error => {
        res.status(400).json({ message: "error!", error });
    });
}

module.exports = {
    index, show, getLive, list, destroy, store
};