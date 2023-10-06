const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const beerImg = new Image();
const glassImg = new Image();

beerImg.src = 'https://drive.google.com/uc?export=view&id=1XfyqMV41WSYpiQR1M2nwIAiat9-3fj7t';
glassImg.src = 'https://drive.google.com/uc?export=view&id=1yXVXDKbJOgiul80BwpggMiMoLjMxmOdK';

const beer = {
    x: Math.random() * canvas.width,
    y: 0,
    speed: 2
};

const glass = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 250,
    speed: 16
};

let score = 0;

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

function playBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function update() {
    beer.y += beer.speed;

    if (beer.y + beerImg.height > glass.y && beer.y < glass.y + glassImg.height && beer.x + beerImg.width > glass.x && beer.x < glass.x + glassImg.width) {
        beer.x = Math.random() * canvas.width;
        beer.y = 0;
        score++;
        playBeep();
    }

    if (beer.y > canvas.height) {
        beer.x = Math.random() * canvas.width;
        beer.y = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(beerImg, beer.x, beer.y);
    ctx.drawImage(glassImg, glass.x, glass.y);

    // Mostrar puntuación en la esquina superior izquierda
    ctx.font = '24px Caveat';
    ctx.fillStyle = 'white';
    ctx.fillText('Puntuación: ' + score, 10, 25);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
