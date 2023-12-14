const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const beerImg = new Image();
const glassImg = new Image();

// Definir proporciones iniciales
const BEER_PROPORTION = 0.2;
const GLASS_PROPORTION = 0.3;

let beerWidth, glassWidth, beerHeight, glassHeight;
let speedIncrements = 0;
let imagesLoaded = 0;
let gameStarted = false;
let score = 0;
let missedBeers = 0;

let beer = {
    x: 0,
    y: 0,
    speed: 2
};

let glass = {
    x: 0,
    y: 0,
    speed: 10
};

function resizeCanvas() {
    const startButtonHeight = document.getElementById('startButton').offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - startButtonHeight; // Resta la altura del botón

    beerWidth = canvas.width * BEER_PROPORTION;
    glassWidth = canvas.width * GLASS_PROPORTION;
    beerHeight = beerWidth * (beerImg.height / beerImg.width);
    glassHeight = glassWidth * (glassImg.height / glassImg.width);

    beer.x = Math.random() * (canvas.width - beerWidth);
    glass.x = canvas.width / 2 - glassWidth / 2;
    glass.y = canvas.height - glassHeight;
    
    draw();
}

// Eventos de teclado
document.addEventListener('keydown', function(event) {
    if(gameStarted){
        switch (event.keyCode) {
            case 37:
                glass.x -= glass.speed;
                if (glass.x < 0) glass.x = 0;
                break;
            case 39:
                glass.x += glass.speed;
                if (glass.x + glassWidth > canvas.width) glass.x = canvas.width - glassWidth;
                break;
        }
    }
});

// Eventos de toque
let touchStartX;
canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
}, false);

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if(gameStarted){
        let touchEndX = e.touches[0].clientX;
        let distanceX = touchEndX - touchStartX;

        glass.x += distanceX;
        if (glass.x < 0) glass.x = 0;
        if (glass.x + glassWidth > canvas.width) glass.x = canvas.width - glassWidth;
        touchStartX = touchEndX;
    }
}, false);

// Carga de imágenes
function imagesAreLoaded() {
    if (imagesLoaded === 2 && gameStarted) {
        resizeCanvas();
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
    imagesLoaded++;
    imagesAreLoaded();
};

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

function update() {
    beer.y += beer.speed;

    if (beer.y + beerHeight > canvas.height) {
        missedBeers++;
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;
    } else if (
        beer.x < glass.x + glassWidth &&
        beer.x + beerWidth > glass.x &&
        beer.y + beerHeight > glass.y &&
        beer.y < glass.y + glassHeight
    ) {
        score++;
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;

        if (score % 10 === 0) {
            beer.speed += 0.5;
        }
    }

    if (glass.x < 0) glass.x = 0;
    if (glass.x + glassWidth > canvas.width) glass.x = canvas.width - glassWidth;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(beerImg, beer.x, beer.y, beerWidth, beerHeight);
    ctx.drawImage(glassImg, glass.x, glass.y, glassWidth, glassHeight);

    ctx.font = '18px Caveat';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 50);
    ctx.fillText(`Missed: ${missedBeers}`, canvas.width - 110, 50);
}

// Inicio y pausa del juego
let gamePaused = false;
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
        startButton.textContent = "Pause";
        loop();
    } else if (!gamePaused) {
        gamePaused = true;
        startButton.textContent = "Resume";
    } else {
        gamePaused = false;
        startButton.textContent = "Pause";
        requestAnimationFrame(loop);
    }
});

// Asegurarse de que el juego comience con el canvas redimensionado adecuadamente
window.addEventListener('load', resizeCanvas);

function loop() {
    if (!gamePaused) {
        update();
        draw();
        requestAnimationFrame(loop);
    }
}

// Escucha el evento resize
window.addEventListener('resize', resizeCanvas);
