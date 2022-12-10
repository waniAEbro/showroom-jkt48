const profil = document.querySelector(".profil");
const lagi_live = document.querySelector(".lagi_live");
let col = card = title = card_body = img = undefined;
let id_profil = [318209, 318118, 318204, 318117, 318207, 400713, 318120, 400717, 318208, 317727, 318112, 317738, 318232, 318222, 318219, 400712, 400716, 400710, 318218, 400715, 318210, 400718, 318227, 318225, 318228, 318224, 317739, 400714, 318230, 318223, 318233, 318229];

const Lagi_live = () => {
    id_profil.forEach(id => {
        try {
            fetch("http://localhost:3000/" + id).then(response => response.json()).then(data => {
                if (data.is_onlive) {
                    id_profil = id_profil.filter(id => id != data.room_id);
                    col = buatCard(data);
                    lagi_live.innerHTML = "";
                    lagi_live.appendChild(col)
                }
            });
        } catch (error) {
            console.log(error)
        }
    });
};

Lagi_live();

setInterval(Lagi_live, 20000);

const Div = (classes) => {
    let div = document.createElement("div");

    classes.forEach(kelas => {
        div.classList.add(kelas)
    });

    return div;
}

const buatCard = (member) => {
    img = document.createElement("img");
    img.src = member.image;
    img.classList.add("card-img-top");

    title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerHTML = member.main_name;

    col = Div(["col-lg-4", "mb-3"]);
    card = Div(["card"]);
    card_body = Div(["card-body"]);

    card.appendChild(img);

    card_body.appendChild(title);

    title = document.createElement("a");
    title.classList.add("btn");
    title.classList.add("btn-primary");
    title.href = "/member/" + member.room_id;
    title.innerHTML = "Lihat Detail";

    card_body.appendChild(title);

    card.appendChild(card_body);

    col.appendChild(card);

    return col;
}

id_profil.forEach(id => {
    try {
        fetch("http://localhost:3000/" + id).then(response => response.json()).then(data => {
            col = buatCard(data);
            profil.appendChild(col);
        });
    } catch (error) {
        console.log(error);
    }
});