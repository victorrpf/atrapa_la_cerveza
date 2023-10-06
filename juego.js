// Juego de adivinar el número

let numeroSecreto = Math.floor(Math.random() * 100) + 1;  // Número entre 1 y 100
let intentos = 0;

function adivinarNumero() {
    let numeroUsuario = parseInt(document.getElementById("numero").value);
    intentos++;

    if (numeroUsuario === numeroSecreto) {
        alert("¡Has adivinado el número en " + intentos + " intentos!");
        reiniciarJuego();
    } else if (numeroUsuario < numeroSecreto) {
        alert("El número secreto es mayor. ¡Inténtalo de nuevo!");
    } else {
        alert("El número secreto es menor. ¡Inténtalo de nuevo!");
    }
}

function reiniciarJuego() {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    intentos = 0;
    document.getElementById("numero").value = '';
}
