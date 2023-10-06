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
    y: canvas.height - 400,
    speed: 12
};

let beerCounter = 0;

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

function update() {
    beer.y += beer.speed;

    if (beer.y + beerImg.height > glass.y && beer.y < glass.y + glassImg.height && beer.x + beerImg.width > glass.x && beer.x < glass.x + glassImg.width) {
        beer.x = Math.random() * canvas.width;
        beer.y = 0;
        beerCounter++;
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

    // Dibujar contador de cervezas
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Cervezas capturadas: ' + beerCounter, 10, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
