const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Proporciones iniciales
const BEER_PROPORTION = 0.2;
const GLASS_PROPORTION = 0.3;

let beerWidth, glassWidth;
let beerHeight, glassHeight;

let speedIncrements = 0;
let imagesLoaded = 0;
let gameStarted = false;
let gamePaused = false;

// Elementos del juego
const beer = {
    x: null, // Se definirá después
    y: 0,
    speed: 2
};

const glass = {
    x: null, // Se definirá después
    y: null, // Se definirá después
    speed: 10
};

let score = 0;
let missedBeers = 0;

// Eventos de teclado
document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // Flecha izquierda
            glass.x -= glass.speed;
            break;
        case 39: // Flecha derecha
            glass.x += glass.speed;
            break;
    }
});

// Eventos táctiles
let touchStartX;
canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
}, false);

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    let touchEndX = e.touches[0].clientX;
    let distanceX = touchEndX - touchStartX;

    if (distanceX < 0) { // Movimiento hacia la izquierda
        glass.x += Math.max(distanceX, -glass.speed);
    } else { // Movimiento hacia la derecha
        glass.x += Math.min(distanceX, glass.speed);
    }

    touchStartX = touchEndX;
}, false);

// Imágenes
const beerImg = new Image();
const glassImg = new Image();

beerImg.onload = function() {
    beerHeight = beerWidth * (beerImg.height / beerImg.width);
    imagesLoaded++;
    imagesAreLoaded();
};

glassImg.onload = function() {
    glassHeight = glassWidth * (glassImg.height / glassImg.width);
    glass.y = canvas.height - glassHeight; // Actualiza la posición y de glass
    imagesLoaded++;
    imagesAreLoaded();
};

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

function imagesAreLoaded() {
    if (imagesLoaded === 2 && gameStarted) {
        resizeCanvas(); // Asegura que el canvas y los elementos se redimensionen según la imagen cargada
        loop();
    }
}

// Redimensionar el canvas y escalar elementos
function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(width / 300, height / 250);

    canvas.width = 300 * scale;
    canvas.height = 250 * scale;

    beerWidth = canvas.width * BEER_PROPORTION;
    glassWidth = canvas.width * GLASS_PROPORTION;

    // Ajusta las dimensiones y posiciones según las imágenes cargadas y el tamaño del canvas
    beerHeight = beerWidth * (beerImg.height / beerImg.width);
    glassHeight = glassWidth * (glassImg.height / glassImg.width);

    beer.x = Math.random() * (canvas.width - beerWidth);
    glass.x = canvas.width / 2 - glassWidth / 2;
    glass.y = canvas.height - glassHeight;

    draw();
}

window.onload = resizeCanvas;
window.onresize = resizeCanvas;

function update() {
    beer.y += beer.speed;

    // Primero verificamos si `beer` ha pasado el punto medio de `glass` y no puede ser atrapado.
    if (beer.y + (beerHeight / 2) > glass.y + glassHeight) {
        // Si `beer` ha caído completamente fuera del canvas, entonces aumentamos el contador de missedBeers.
        if (beer.y > canvas.height) {
            missedBeers++;
            beer.x = Math.random() * (canvas.width - beerWidth);
            beer.y = 0;
        }
    } 
    // Luego, verificamos si `beer` ha sido atrapado por `glass`.
    else if (
        beer.y + (beerHeight / 2) > glass.y && 
        beer.y + (beerHeight / 2) < glass.y + glassHeight && 
        beer.x + beerWidth > glass.x && 
        beer.x < glass.x + glassWidth
    ) {
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;
        score++;

        // Verificar si es necesario aumentar la velocidad.
        if (score % 100 === 0) {
            speedIncrements++;
            beer.speed += 1; // Aumentar la velocidad en una unidad.
        }
    }

    // Asegurarse de que `glass` no se salga de los límites del canvas.
    if (glass.x < 0) glass.x = 0;
    if (glass.x + glassWidth > canvas.width) glass.x = canvas.width - glassWidth;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(beerImg, beer.x, beer.y, beerWidth, beerHeight);
    ctx.drawImage(glassImg, glass.x, glass.y, glassWidth, glassHeight);

    ctx.font = '14px Caveat';
    ctx.fillStyle = 'black';
    ctx.fillText('Atrapadas ' + score, 10, 25);

    const missedText = 'Perdidas ' + missedBeers;
    const textWidth = ctx.measureText(missedText).width;
    ctx.fillText(missedText, canvas.width - textWidth - 10, 25);

    // Dibujo del contador de incrementos de velocidad en el centro
    const speedText = 'Velocidad +' + speedIncrements;
    const speedTextWidth = ctx.measureText(speedText).width;
    ctx.fillText(speedText, (canvas.width - speedTextWidth) / 2, 25);
}


// Iniciar/pausar el juego
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    if (startButton.textContent === "Iniciar Juego") {
        gameStarted = true;
        if (imagesLoaded === 2) {
            loop();
        }
        startButton.textContent = "STOP";
    } else if (startButton.textContent === "STOP") {
        gamePaused = !gamePaused;
        if (!gamePaused) {
            requestAnimationFrame(loop);
            startButton.textContent = "Pausa";
        } else {
            startButton.textContent = "Continuar";
        }
    } else {
        gamePaused = false;
        requestAnimationFrame(loop);
        startButton.textContent = "STOP";
    }
});

function loop() {
    if (!gamePaused) {
        update();
        draw();
        requestAnimationFrame(loop);
    }
}
