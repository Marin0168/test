globalThis.onload = function() {
    var naam = document.getElementById("Naam");
    const text = "Merijn van Hien";

    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            naam.innerHTML += text[i];
        }, i * 200);
    }
}