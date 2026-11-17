const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const restartButton = document.querySelector('.btn-restart')

const highScoreElement = document.querySelector('#high-score')
const scoreElement = document.querySelector('#score')
const timeElement = document.querySelector('#time')

const blockWidth = 50
const blockHeight = 50

let highScore = localStorage.getItem("highScore") || 0;
let score = 0
let time = `00-00`

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timeIntervalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
const blocks = [];

let snake = [{
    x: 1, y: 3
}];

let diraction = 'down';

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div')
        block.classList.add("block")
        board.appendChild(block)
        // block.innerText = `${row}-${col}`
        blocks[`${row}-${col}`] = block;
    }
}

function render() {


    let head = null

    if (diraction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (diraction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (diraction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }
    else if (diraction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // wall collision logic
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId)

        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";

        return;
    }

    // Food consume logic
    if (head.x === food.x && head.y === food.y) {

        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food")

        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if (score > highScore) {
            highScore = score
            localStorage.setItem("highScore", highScore.toString())

        }
    }


    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    snake.pop()

    blocks[`${food.x}-${food.y}`].classList.add("food")

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })
}

// intervalId = setInterval(() => {
//     render()
// }, 400);

startButton.addEventListener("click", () => {

    modal.style.display = "none";
    intervalId = setInterval(() => { render() }, 400)

    timeIntervalId = setInterval(() => {
        let [minutes, seconds] = time.split("-").map(Number)

        if (seconds == 59) {
            minutes += 1
            seconds = 0
        }
        else {
            seconds += 1
        }
        time = `${minutes}-${seconds}`

        timeElement.innerText = time
    }, 1000)
})

restartButton.addEventListener("click", resetGame)

function resetGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    score = 0
    highScore = localStorage.getItem("highScore") || 0;
    time = `00-00`

    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore


    modal.style.display = "none";
    diraction = 'down';
    snake = [{ x: 1, y: 3 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    intervalId = setInterval(() => { render() }, 400)
}


addEventListener("keydown", (event) => {

    if (event.key == "ArrowDown") {
        diraction = "down"
    }
    else if (event.key == "ArrowUp") {
        diraction = "up"
    }
    else if (event.key == "ArrowRight") {
        diraction = "right"
    }
    else if (event.key == "ArrowLeft") {
        diraction = "left"
    }
})

