const socket = io();

socket.on("qr", qr => {
    document.getElementById("qr").src = qr;
});

socket.on("message", message => {
    document.getElementById("message").innerHTML = message;
})