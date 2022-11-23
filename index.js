const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const http = require("http");
const { Server } = require("socket.io");
const {
    Client,
    LocalAuth
} = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const client = new Client();

app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("index", { layout: "layouts/main", title: "Home" });
});

app.get("/qr", (req, res) => {
    res.render("whatsapp", { layout: "layouts/main", title: "Home" });
});

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