const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const beerImg = new Image();
const glassImg = new Image();

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

// Definir proporciones iniciales
const BEER_PROPORTION = 0.1;  
const GLASS_PROPORTION = 0.2; 

let beerWidth, beerHeight, glassWidth, glassHeight;

function resizeImages() {
    beerWidth = canvas.width * BEER_PROPORTION;
    beerHeight = beerWidth * (beerImg.naturalHeight / beerImg.naturalWidth);

    glassWidth = canvas.width * GLASS_PROPORTION;
    glassHeight = glassWidth * (glassImg.naturalHeight / glassImg.naturalWidth);
}

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

    resizeImages();

    beer.x = Math.random() * (canvas.width - beerWidth);
    glass.x = canvas.width / 2 - glassWidth / 2;
    glass.y = canvas.height - glassHeight;
}

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
        case 37: 
            glass.x -= glass.speed;
            break;
        case 39: 
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

    if (distanceX < 0) {
        glass.x += Math.max(distanceX, -glass.speed);
    } else {
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

    if (beer.y + beerHeight > glass.y && beer.y < glass.y + glassHeight && beer.x + beerWidth > glass.x && beer.x < glass.x + glassWidth) {
        beer.x = Math.random() * (canvas.width - beerWidth);
        beer.y = 0;
        score++;
        playBeep();
    }

    if (beer.y > canvas.height) {
        playFailSound();
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

resizeCanvas();
loop();
window.addEventListener('resize', resizeCanvas);
