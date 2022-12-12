const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const https = require("https");
const http = require("http");
const Socket = require("socket.io");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
const server = http.createServer(app);
const port = 3000;
const io = Socket(server);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("index", { layout: "layouts/main", title: "Home" });
});

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
});

app.get("/member/:id", (req, res) => {
    res.render("detail", { layout: "layouts/main", title: "Detail", id: req.params.id });
});

app.get("/api/:id", (req, res) => {
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
});

app.get("/whatsapp", (req, res) => {
    res.render("whatsapp", { layout: "layouts/main", title: "Whatsapp" });
});

app.use("/", (req, res) => {
    console.log("routenya ga ada nih");
    res.send("halaman tidak ditemukan");
});

client.initialize();

io.on("connection", (socket) => {
    client.on("qr", qr => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit("status", "silahkan scan qr code");
        })
    });

    client.on("ready", () => {
        socket.emit("status", "Whatsapp sudah terhubung");
    })

    client.on("authenticated", () => {
        socket.emit("status", "whatsapp siap untuk digunakan");
    })
});

client.on("message", async (msg) => {
    msg.reply(msg.body);
})

server.listen(port, () => {
    console.log(`anda terhubung dengan port : ${port}`);
});