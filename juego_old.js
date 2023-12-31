const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 250;
canvas.height = 300;

const beerImg = new Image();
const glassImg = new Image();

// Definir proporciones iniciales
const BEER_PROPORTION = 0.2;
const GLASS_PROPORTION = 0.3;

let beerWidth = canvas.width * BEER_PROPORTION;
let glassWidth = canvas.width * GLASS_PROPORTION;
let beerHeight, glassHeight; // Estas se definirán cuando las imágenes se carguen

let speedIncrements = 0; // Contador para los incrementos de velocidad
let imagesLoaded = 0;
let gameStarted = false;

const beer = {
    x: Math.random() * (canvas.width - beerWidth),
    y: 0,
    speed: 2
};

const glass = {
    x: canvas.width / 2 - glassWidth / 2,
    y: canvas.height - glassHeight, // Definiremos glassHeight más tarde
    speed: 10
};

let score = 0;
let missedBeers = 0;

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

function imagesAreLoaded() {
    if (imagesLoaded === 2 && gameStarted) {
        loop();
    }
}

beerImg.onload = function() {
    beerHeight = beerWidth * (beerImg.height / beerImg.width);
    imagesLoaded++;
    imagesAreLoaded();
};

glassImg.onload = function() {
    glassHeight = glassWidth * (glassImg.height / glassImg.width);
    glass.y = canvas.height - glassHeight; // Aquí se define correctamente la posición y de glass
    imagesLoaded++;
    imagesAreLoaded();
};

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

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

let gamePaused = false;

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    if (startButton.textContent === "Iniciar Juego") {
        gameStarted = true;
        if (imagesLoaded === 2) {
            loop();
        }
        startButton.textContent = "STOP";
    } else if (startButton.textContent === "STOP") {
        gamePaused = true;
        startButton.textContent = "Continuar";
    } else {
        gamePaused = false;
        loop();
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
