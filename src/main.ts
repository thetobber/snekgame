import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const context = canvas.getContext("2d")!;

type SnakePart = {
  x: number;
  y: number;
};

enum Direction {
  Up,
  Left,
  Down,
  Right,
}

let gameRunning = false;

let snake: SnakePart[] = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let food = {
  x: 280,
  y: 280,
};

let snakeVelocityX = 10;
let snakeVelocityY = 0;
let snakeDirection = Direction.Right;

function drawSnakePart(snakePart: SnakePart) {
  context.fillStyle = "lightgreen";
  context.strokeStyle = "darkgreen";
  context.fillRect(snakePart.x, snakePart.y, 10, 10);
  context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
  context.fillStyle = "pink";
  context.strokeStyle = "darkred";
  context.fillRect(food.x, food.y, 10, 10);
  context.strokeRect(food.x, food.y, 10, 10);
}

function moveSnake() {
  let x = snake[0].x + snakeVelocityX;
  let y = snake[0].y + snakeVelocityY;

  if (x === canvas.width) x = 0;
  else if (x === -10) x = canvas.width - 10;
  else if (y === canvas.height) y = 0;
  else if (y === -10) y = canvas.height - 10;

  snake.unshift({ x, y });
  snake.pop();

  for (let index = 0; index < snake.length; index++) {
    if (index !== 0 && snake[index].x === x && snake[index].y === y) {
      gameRunning = false;
      snakeDirection = Direction.Right;
      snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 },
      ];
    }
  }
}

function changeDirection({ key }: KeyboardEvent) {
  key = key.toLowerCase();

  // pause or resume game
  if (key === " ") {
    gameRunning = !gameRunning;
  }

  if (!gameRunning) return;

  // set snek to move up
  if (
    (key === "w" || key === "arrowup") &&
    snakeDirection !== Direction.Up &&
    snakeDirection !== Direction.Down
  ) {
    snakeDirection = Direction.Up;
    snakeVelocityX = 0;
    snakeVelocityY = -10;
  }

  // set snek to move left
  else if (
    (key === "a" || key === "arrowleft") &&
    snakeDirection !== Direction.Left &&
    snakeDirection !== Direction.Right
  ) {
    snakeDirection = Direction.Left;
    snakeVelocityX = -10;
    snakeVelocityY = 0;
  }

  // set snek to move down
  else if (
    (key === "s" || key === "arrowdown") &&
    snakeDirection !== Direction.Down &&
    snakeDirection !== Direction.Up
  ) {
    snakeDirection = Direction.Down;
    snakeVelocityX = 0;
    snakeVelocityY = 10;
  }

  // set snek to move right
  else if (
    (key === "d" || key === "arrowright") &&
    snakeDirection !== Direction.Right &&
    snakeDirection !== Direction.Left
  ) {
    snakeDirection = Direction.Right;
    snakeVelocityX = 10;
    snakeVelocityY = 0;
  }
}

function drawInitialFrame() {
  context.fillStyle = "lightgray";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
}

function draw() {
  setTimeout(function () {
    if (gameRunning) {
      context.fillStyle = "lightgray";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(0, 0, canvas.width, canvas.height);
      moveSnake();
      drawFood();
      drawSnake();
    }

    requestAnimationFrame(draw);
  }, 100);
}

window.addEventListener("resize", () => (gameRunning = false));
window.addEventListener("keydown", changeDirection);
drawInitialFrame();
requestAnimationFrame(draw);
