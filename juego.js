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

beerImg.src = 'cerveza_amstel_pequeña.png';
glassImg.src = 'cubo_pequeño.png';

function update() {
    beer.y += beer.speed;

    // Si la cerveza cae completamente fuera del canvas, aumentar missedBeers
    if (beer.y + beerHeight > canvas.height) {
        missedBeers++;
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;
    } 
    // Comprobar si la mitad de la cerveza está sobre el vaso
    else if (
        beer.x < glass.x + glassWidth &&
        beer.x + beerWidth > glass.x &&
        beer.y + beerHeight / 2 > glass.y &&
        beer.y + beerHeight / 2 < glass.y + glassHeight
    ) {
        score++;
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;

        // Aumentar la velocidad cada 100 puntos
        if (score % 100 === 0) {
            speedIncrements++;
            beer.speed += 1;
        }
    }

    // Asegurar que el vaso no se salga de los límites del canvas
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
