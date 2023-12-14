const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Establecer proporciones iniciales
const BEER_PROPORTION = 0.2;
const GLASS_PROPORTION = 0.3;

let beerWidth, glassWidth, beerHeight, glassHeight; // Estas se definirán en resizeCanvas()

let speedIncrements = 0; // Contador para los incrementos de velocidad
let imagesLoaded = 0;
let gameStarted = false;

// Definir objetos para la cerveza y la copa
let beer = {
    x: 0, // La posición x se establecerá en resizeCanvas()
    y: 0,
    speed: 2
};

let glass = {
    x: 0, // La posición x se establecerá en resizeCanvas()
    y: 0, // La posición y se establecerá en resizeCanvas()
    speed: 10
};

let score = 0;
let missedBeers = 0;

// Función de redimensionamiento para ajustar el canvas y elementos del juego
function resizeCanvas() {
    // Ajustar el canvas al tamaño de la ventana o contenedor
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Ajustar las dimensiones de la cerveza y la copa
    beerWidth = canvas.width * BEER_PROPORTION;
    glassWidth = canvas.width * GLASS_PROPORTION;
    if (beerImg.complete) {
        beerHeight = beerWidth * (beerImg.height / beerImg.width);
    }
    if (glassImg.complete) {
        glassHeight = glassWidth * (glassImg.height / glassImg.width);
    }

    // Ajustar las posiciones
    beer.x = Math.random() * (canvas.width - beerWidth);
    beer.y = 0; // Resetear la posición y de la cerveza
    glass.x = canvas.width / 2 - glassWidth / 2;
    glass.y = canvas.height - (glassHeight || 0); // Usar || para manejar el caso en que glassHeight aún no se haya definido
}

// Añadir el controlador de eventos para el redimensionamiento de la ventana
window.addEventListener('resize', resizeCanvas);

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

// Asegurarse de que el canvas se redimensione al cargar el juego
resizeCanvas();
