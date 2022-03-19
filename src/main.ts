import "./style.css";

const scoreText = document.querySelector<HTMLHeadingElement>("#score")!;
const toggleButton = document.querySelector<HTMLButtonElement>("#toggle")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;
const rotateInput = document.querySelector<HTMLInputElement>("#rotate")!;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const context = canvas.getContext("2d")!;

// type Point = {
//   x: number;
//   y: number;
// };

type Point = [x: number, y: number];

enum Direction {
  Up,
  Left,
  Down,
  Right,
}

let gameRunning = false;
let gameOver = false;

let snakeSize = 10;
let snakeVelocityX = snakeSize;
let snakeVelocityY = 0;
let snakeDirection = Direction.Right;
let snake: Point[] = createSnake();

let foodSize = 10;
let food: Point = createFood();

let score = 0;

function getRandomPosition(min: number, max: number, toNearest: number) {
  return (
    Math.round((Math.random() * (max - min) + min) / toNearest) * toNearest
  );
}

function createSnake() {
  const initialX = canvas.width / 2 - snakeSize * 3;
  const initialY = canvas.height / 2;

  let initialSnake: Point[] = [];

  for (let index = 0; index < 3; index++) {
    initialSnake.push([initialX + snakeSize * index, initialY]);
  }

  return initialSnake.reverse();
}

function drawSnake() {
  for (const point of snake) {
    context.fillStyle = "lightgreen";
    context.strokeStyle = "darkgreen";
    context.fillRect(point[0], point[1], snakeSize, snakeSize);
    context.strokeRect(point[0], point[1], snakeSize, snakeSize);
  }
}

function createFood() {
  const x = getRandomPosition(0, canvas.width, foodSize);
  const y = getRandomPosition(0, canvas.height, foodSize);

  let newFood: Point;

  for (const snakePoint of snake) {
    if (snakePoint[0] === x && snakePoint[1] === y) {
      createFood();
    } else {
      newFood = [x, y];
    }
  }

  return newFood!;
}

function drawFood() {
  context.fillStyle = "pink";
  context.strokeStyle = "darkred";
  context.fillRect(food[0], food[1], foodSize, foodSize);
  context.strokeRect(food[0], food[1], foodSize, foodSize);
}

function moveSnake() {
  let x = snake[0][0] + snakeVelocityX;
  let y = snake[0][1] + snakeVelocityY;

  // wraparound to other side when out of bounds
  if (x === canvas.width) x = 0;
  else if (x === -snakeSize) x = canvas.width - snakeSize;
  else if (y === canvas.height) y = 0;
  else if (y === -snakeSize) y = canvas.height - snakeSize;

  // check for body collision
  for (let index = 0; index < snake.length; index++) {
    if (index !== 0 && snake[index][0] === x && snake[index][1] === y) {
      gameOver = true;
    }
  }

  // insert head at new position
  snake.unshift([x, y]);

  // check for food collision
  if (x === food[0] && y === food[1]) {
    // don't remove tail if collision with food is detected
    food = createFood();
    score += 1;
    updateScore();
  } else {
    // remove tail
    snake.pop();
  }
}

function updateToggleButton() {
  if (gameRunning) toggleButton.innerText = "Pause (Space)";
  else toggleButton.innerText = "Resume (Space)";
}

function updateScore() {
  scoreText.innerText = score.toString();
}

function changeDirection({ key }: KeyboardEvent) {
  key = key.toLowerCase();

  if (key === "escape") {
    resetGame();
    return;
  }

  if (key === " ") {
    gameRunning = !gameRunning;
    updateToggleButton();
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

function drawBlankBackground() {
  context.fillStyle = "lightgray";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawInitial() {
  drawBlankBackground();
  drawFood();
  drawSnake();
}

function draw() {
  setTimeout(function () {
    if (gameRunning) {
      drawBlankBackground();
      drawFood();
      moveSnake();
      drawSnake();
    }

    if (gameOver) resetGame();

    requestAnimationFrame(draw);
  }, 100);
}

function resetGame() {
  gameOver = false;
  gameRunning = false;
  score = 0;

  snakeDirection = Direction.Right;
  snakeVelocityX = snakeSize;
  snakeVelocityY = 0;
  snake = createSnake();
  food = createFood();

  console.log(snakeDirection, snakeVelocityX, snakeVelocityY);

  updateScore();
  updateToggleButton();
  drawInitial();
}

window.addEventListener("resize", () => (gameRunning = false));
window.addEventListener("keydown", changeDirection);

toggleButton.addEventListener("click", function () {
  gameRunning = !gameRunning;
  updateToggleButton();
  toggleButton.blur();
});

resetButton.addEventListener("click", function () {
  resetGame();
  resetButton.blur();
});

rotateInput.addEventListener("input", function () {
  canvas.style.transform = `rotate(${rotateInput.value}deg)`;
});

drawInitial();
requestAnimationFrame(draw);
