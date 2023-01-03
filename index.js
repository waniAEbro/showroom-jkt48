const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const http = require("http");
const https = require("https");
const Socket = require("socket.io");
const { Client, RemoteAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const MemberRoutes = require("./routes/MemberRoutes.js");
const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");
const WhatsappRoutes = require("./routes/WhatsappRoutes.js");
const AuthRoutes = require("./routes/AuthRoutes.js");

mongoose.connect("mongodb://127.0.0.1:27017/showroom_jkt48").then(() => {
    const store = new MongoStore({ mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        }),
        puppeteer: {
            args: [
                '--no-sandbox'
            ]
        }
    })

    client.initialize();

    const checkLive = () => {
        Member.find().then(data => {
            data.forEach(member => {
                https.get("https://www.showroom-live.com/api/room/profile?room_id=" + member.info.room_id, (response) => {
                    let respond = "";

                    response.on("data", data => {
                        respond += data;
                    })

                    response.on("end", () => {
                        respond = JSON.parse(respond);

                        if (respond.is_onlive) {
                            Member.findByIdAndUpdate(member._id, {
                                "info.is_onlive": true,
                            }).catch(error => console.log(error));

                            if (!member.is_notified) {
                                Whatsapp.find().then(whatsapps => {
                                    whatsapps.forEach(whatsapp => {
                                        client.sendMessage(whatsapp.nomor, `Hai, ${member.info.main_name} sedang live! silakan kunjungi http://www.waniaebro.xyz/member/${member._id} untuk menonton`).then(() => {
                                            Member.findByIdAndUpdate(member._id, {
                                                is_notified: true
                                            }).catch(error => console.log(error));
                                        }).catch(error => console.log(error));
                                    })
                                })
                            }
                        } else {
                            Member.findByIdAndUpdate(member._id, {
                                is_notified: false,
                                "info.is_onlive": false,
                            }).catch(error => console.log(error))
                        }
                    })
                }).on("error", error => console.log(error))
            });
        })
    };

    setInterval(checkLive, 60000);

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

    client.on("message", async message => {
        message.reply("maaf, kami tidak bisa membalas pesan anda 🙏");
    });
});

const Member = require("./models/member.js");
const Whatsapp = require("./models/whatsapp.js");
const User = require("./models/user.js");

const app = express();
const server = http.createServer(app);
const port = 3000;
const io = Socket(server);

app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.redirect("/member");
});

app.use(AuthRoutes);

app.use("/member", MemberRoutes);

app.use("/whatsapp", WhatsappRoutes);

app.use("/", (req, res) => {
    res.status(404).render("404", { layout: "layouts/main", title: "404" });
});

server.listen(port, () => {
    console.log(`anda terhubung dengan port : ${port}`);
});