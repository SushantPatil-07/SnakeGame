const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20; 
let rows, cols;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {};
let score = 0;
let direction;
let gameOver = false;
let speed = 100;
let game;
let isPaused = false;


function resizeCanvas() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const minDimension = Math.min(screenWidth, screenHeight) * 0.9;


    canvas.width = minDimension;
    canvas.height = minDimension;

  
    rows = Math.floor(canvas.height / box);
    cols = Math.floor(canvas.width / box);

    resetFood();
}


document.addEventListener("keydown", directionControl);

function directionControl(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
    else if (event.keyCode === 32) togglePause(); 
}


function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(game);
    } else {
        game = setInterval(draw, speed);
    }
}


function resetFood() {
    food = {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }


    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

   
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

  
    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;


    if (snakeX === food.x && snakeY === food.y) {
        score++;
        resetFood();
    } else {
        snake.pop(); 
    }

  
    let newHead = { x: snakeX, y: snakeY };

    
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
        gameOver = true;
    }

    snake.unshift(newHead);


    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, box, 20);
}


function startGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    gameOver = false;
    game = setInterval(draw, speed);
}


window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 
startGame();
