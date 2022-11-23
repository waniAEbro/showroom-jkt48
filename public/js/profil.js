const profil = document.querySelector(".profil");
const lagi_live = document.querySelector(".lagi_live");
let genres = member = col = card = title = card_body = img = undefined;
const id_profil = [318209, 318118, 318204, 318117, 318207, 400713, 318120, 400717, 318208, 317727, 318112, 318112, 317738, 318232, 318222, 318219, 400712, 400716, 400710, 318218, 400715, 318210, 400718, 318227, 318225, 318228, 318224, 317739, 400714, 318230, 318223, 318233, 318229];

const Lagi_live = async () => {
    lagi_live.innerHTML = "";

    if (lagi_live.children.length <= 1) {
        title = document.createElement("p");
        title.innerHTML = "yahh, lagi ga ada yang live nih 😓";

        lagi_live.appendChild(title);
    }

    genres = await fetch("https://www.showroom-live.com/api/live/onlives").then(response => response.json());

    id_profil.forEach(id => {
        genres.onlives.forEach(genre => {
            if (genre.lives.find(live => live.room_id == id)) {
                buatCard(id);
            }
        });
    })

}

Lagi_live();

setInterval(Lagi_live, 10000);

const Div = (classes) => {
    let div = document.createElement("div");

    classes.forEach(kelas => {
        div.classList.add(kelas)
    });

    return div;
}

const buatCard = async (id) => {
    try {
        member = await fetch("https://www.showroom-live.com/api/room/profile?room_id=" + id).then(response => response.json());
    } catch (error) {
        console.log(error);
    }

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

    card.appendChild(card_body);

    col.appendChild(card);

    profil.appendChild(col);
}

id_profil.forEach(id => {
    buatCard(id);
});