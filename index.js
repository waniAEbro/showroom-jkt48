const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const https = require("https");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("index", { layout: "layouts/main", title: "Home" });
});

app.get("/qr", (req, res) => {
    res.render("whatsapp", { layout: "layouts/main", title: "Whatsapp" });
});

app.get("/nonton", (req, res) => {
    res.render("nonton", { layout: "layouts/main", title: "Nonton" })
})

app.get("/:id", (req, res) => {
    https.get("https://www.showroom-live.com/api/room/profile?room_id=" + req.params.id, (response) => {
        let respond = "";
        response.on("data", data => {
            respond += data;
        })

        response.on("end", () => {
            res.send(JSON.parse(respond));
        })
    }).on("error", (error) => {
        console.log(error)
    });
})

app.get("/live/:id", (req, res) => {
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
})

app.get("/member/:id", (req, res) => {
    res.render("detail", { layout: "layouts/main", title: "Detail", id: req.params.id });
})

app.listen(port, () => {
    console.log(`anda terhubung dengan port : ${port}`);
});