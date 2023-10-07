const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const beerImg = new Image();
const glassImg = new Image();

// Definir proporciones iniciales
const BEER_PROPORTION = 0.15;
const GLASS_PROPORTION = 0.2;

let beerWidth, beerHeight, glassWidth, glassHeight;
let imagesLoaded = 0;
let gameStarted = false;

const beer = {
    x: 0,
    y: 0,
    speed: 2
};

const glass = {
    x: 0,
    y: 0,
    speed: 16
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

function resizeCanvas() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    canvas.width = windowWidth;
    canvas.height = windowHeight;

    beerWidth = canvas.width * BEER_PROPORTION;
    beerHeight = beerWidth * (beerImg.height / beerImg.width);
    glassWidth = canvas.width * GLASS_PROPORTION;
    glassHeight = glassWidth * (glassImg.height / glassImg.width);

    beer.x = Math.random() * (canvas.width - beerWidth);
    glass.x = canvas.width / 2 - glassWidth / 2;
    glass.y = canvas.height - glassHeight;
}

function imagesAreLoaded() {
    if (imagesLoaded === 2) {
        resizeCanvas();
        if (gameStarted) {
            loop();
        }
    }
}

beerImg.onload = function() {
    imagesLoaded++;
    imagesAreLoaded();
};

glassImg.onload = function() {
    imagesLoaded++;
    imagesAreLoaded();
};

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

function update() {
    beer.y += beer.speed;

    if (beer.y + beerHeight > glass.y && beer.y < glass.y + glassHeight && beer.x + beerWidth > glass.x && beer.x < glass.x + glassWidth) {
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;
        score++;
    }

    if (beer.y > canvas.height) {
        missedBeers++;
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;
    }

    if (glass.x < 0) glass.x = 0;
    if (glass.x + glassWidth > canvas.width) glass.x = canvas.width - glassWidth;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(beerImg, beer.x, beer.y, beerWidth, beerHeight);
    ctx.drawImage(glassImg, glass.x, glass.y, glassWidth, glassHeight);

    ctx.font = '24px Caveat';
    ctx.fillStyle = 'black';
    ctx.fillText('Atrapadas: ' + score, 10, 25);

    const missedText = 'Perdidas: ' + missedBeers;
    const textWidth = ctx.measureText(missedText).width;
    ctx.fillText(missedText, canvas.width - textWidth - 10, 25);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', resizeCanvas);

// Botón de inicio
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    startButton.style.display = 'none';
    gameStarted = true;
    if (imagesLoaded === 2) {
        loop();
    }
});
