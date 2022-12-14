const Member = require("../models/member");
const https = require("https");

const index = (req, res) => {
    Member.find().then(members => {
        let lives = members.filter(member => member.info.is_onlive);
        res.render("index", { layout: "layouts/main", title: "Home", members, lives });
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
    let id_profil = [318209, 318118, 318204, 318117, 318207, 400713, 318120, 400717, 318208, 317727, 318112, 317738, 318232, 318222, 318219, 400712, 400716, 400710, 318218, 400715, 318210, 400718, 318227, 318225, 318228, 318224, 317739, 400714, 318230, 318223, 318233, 318229];

    id_profil.forEach(id => {
        https.get("https://www.showroom-live.com/api/room/profile?room_id=" + id, (response) => {
            let respond = "";

            response.on("data", data => {
                respond += data;
            })

            response.on("end", () => {
                console.log(JSON.parse(respond))
                const member = new Member({
                    info: JSON.parse(respond),
                    is_notified: false
                })

                member.save();
            })
        }).on("error", error => {
            console.log(error);
        });
    });
    res.send("halo");
};

module.exports = {
    index, show, getLive, updateDatabase
};