const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const beerImg = new Image();
const glassImg = new Image();

beerImg.src = 'https://www.monastrellissimo.com/wp-content/uploads/cerveza-amstel.jpg';
glassImg.src = 'https://scontent-bcn1-1.xx.fbcdn.net/v/t39.30808-6/384574668_843467954092343_4145059756571346169_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5614bc&_nc_ohc=KBFbaPMpfscAX_05YwH&_nc_ht=scontent-bcn1-1.xx&oh=00_AfC2afQjgzRzLOljY3uxQBJDiONA9H1FoCdtFZuBcoxzeA&oe=6524C582';

const beer = {
    x: Math.random() * canvas.width,
    y: 0,
    speed: 2
};

const glass = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    speed: 4
};

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
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
