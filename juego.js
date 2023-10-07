const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const beerImg = new Image();
const glassImg = new Image();

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

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

function resizeCanvas() {
    let windowWidth = window.innerWidth;
    let canvasWidth = windowWidth;
    let canvasHeight = (canvasWidth * 640) / 960;

    if (canvasHeight > window.innerHeight) {
        canvasHeight = window.innerHeight;
        canvasWidth = (canvasHeight * 960) / 640;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Actualizar las posiciones iniciales de beer y glass después de redimensionar
    beer.x = Math.random() * (canvas.width - beerImg.width);
    glass.x = canvas.width / 2 - 100;
    glass.y = canvas.height - 250;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

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

function playBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function playFailSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(415.30, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function update() {
    beer.y += beer.speed;

    if (beer.y + beerImg.height > glass.y && beer.y < glass.y + glassImg.height && beer.x + beerImg.width > glass.x && beer.x < glass.x + glassImg.width) {
        beer.x = Math.random() * (canvas.width - beerImg.width);
        beer.y = 0;
        score++;
        playBeep();
    }

    if (beer.y > canvas.height) {
        playFailSound();
        missedBeers++;
        beer.x = Math.random() * (canvas.width - beerImg.width);
        beer.y = 0;
    }

    if (glass.x < 0) glass.x = 0;
    if (glass.x + glassImg.width > canvas.width) glass.x = canvas.width - glassImg.width;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(beerImg, beer.x, beer.y);
    ctx.drawImage(glassImg, glass.x, glass.y);

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

loop();
