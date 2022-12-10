const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const http = require("http");
const https = require("https");
const { Server } = require("socket.io");
const {
    Client,
    LocalAuth
} = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { resolve } = require("path");
const id_profil = [318209, 318118, 318204, 318117, 318207, 400713, 318120, 400717, 318208, 317727, 318112, 318112, 317738, 318232, 318222, 318219, 400712, 400716, 400710, 318218, 400715, 318210, 400718, 318227, 318225, 318228, 318224, 317739, 400714, 318230, 318223, 318233, 318229];
let lagi_live = [];

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    }
});

app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methids", "GET, POST, PUT, PATCH, DELTE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

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
    res.render("detail", { layout: "layouts/main", title: "Detail", member: req.params.id })
})

io.on("connection", (socket) => {
    socket.emit("message", "Loading ... ")

    client.on("qr", qr => {
        qrcode.toDataURL(qr, (error, url) => {
            socket.emit("qr", url);
            socket.emit("message", "Silakan Scan QR Code")
        })
    })

    client.on('authenticated', () => {
        socket.emit("qr", "https://media.istockphoto.com/id/1212568100/vector/happy-young-employees-giving-support-and-help-each-other.jpg?b=1&s=612x612&w=0&k=20&c=0sFel4HwLblL03lIAN1zL2_RopW3zpZCvdI6pBzI7y0=")
        socket.emit("message", "Whatsapp Siap Digunakan");
    });

    client.on('ready', () => {
        socket.emit("qr", "https://media.istockphoto.com/id/1212568100/vector/happy-young-employees-giving-support-and-help-each-other.jpg?b=1&s=612x612&w=0&k=20&c=0sFel4HwLblL03lIAN1zL2_RopW3zpZCvdI6pBzI7y0=")
        socket.emit("message", "Whatsapp Siap Digunakan")
    });

    client.on('disconnected', (reason) => {
        socket.emit("message", reason);
    });
});

client.on("message", async message => {
    if (message.body) {
        message.reply(message.from);
    }
})

client.initialize();

server.listen(port, () => {
    console.log(`anda terhubung dengan port : ${port}`);
});
