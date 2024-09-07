const cars = document.querySelectorAll(".car");
const player = document.getElementById("player");
const gameBoard = document.getElementById("game-board");
const gameIntro = document.getElementById("game-intro");
const gameOverScreen = document.getElementById("game-over-screen");
const aimenHP = document.getElementById("aimenHP");
const aimen = document.getElementById("aimen");
const rim = document.getElementById("rim");
const basketBallHall = document.getElementById("basketBallHall");
const ball = document.getElementById("ball");

const introAudio = new Audio('yard-theme.mp3');
const startAudio = new Audio('start.mp3'); 
const aimenAudio = new Audio('aimen.mp3');
const aimenDeadAudio = new Audio('aimen_dead.mp3');
const loseAudio = new Audio('lose.mp3');
const aimenLoseAudio = new Audio('aimen_lose.mp3');
const winAudio = new Audio('win.mp3');
const clappingAudio = new Audio('clapping.wav');
const battleAudio = new Audio('battle.mp3');
const ballSpeed = 5;

let ludwigWon = false;
let timeLeft = 60;
let timerInterval;
let swapImage = true;
let step = 50;
let basketball = false;
let gameRunning = true;
let playerPosition = { x: 0, y: 200 };
let aimenPosition = { x: 575, y: 50 };
let aimenSpeed = 1;
let TENTIMESFASTERTHANFROGGER = 20;
let aimenIsShooting = false;
let carData = [
  { x: 50, y: Math.random() * (-2000 + 150) - 150 },
  { x: 150, y: Math.random() * (-2000 + 150) - 150 },
  { x: 250, y: Math.random() * (-2000 + 150) - 150 },
  { x: 350, y: Math.random() * (-2000 + 150) - 150 },
  { x: 450, y: Math.random() * (-2000 + 150) - 150 },
  { x: 550, y: Math.random() * (-2000 + 150) - 150 },
  { x: 650, y: Math.random() * (-2000 + 150) - 150 },
  { x: 750, y: Math.random() * (-2000 + 150) - 150 },
  { x: 850, y: Math.random() * (-2000 + 150) - 150 },
  { x: 950, y: Math.random() * (-2000 + 150) - 150 },
  { x: 1050, y: Math.random() * (-2000 + 150) - 150 },
];

document.addEventListener("keydown", (event) => {
  if (gameRunning) {
    switch (event.key) {
      case "ArrowUp":
        swapImage = !swapImage;
        player.style.backgroundImage = `url('${!basketball ? "aimen" : "ludwig"}_${swapImage ? 1 : 2}.png')`;
        movePlayer(0, -step);
        break;
      case "ArrowDown":
        swapImage = !swapImage;
        player.style.backgroundImage = `url('${!basketball ? "aimen" : "ludwig"}_${swapImage ? 1 : 2}.png')`;
        movePlayer(0, step);
        break;
      case "ArrowLeft":
        swapImage = !swapImage;
        player.style.backgroundImage = `url('${!basketball ? "aimen" : "ludwig"}_${swapImage ? 1 : 2}.png')`;
        player.style.transform = "scaleX(-1)";
        movePlayer(-step, 0);
        break;
      case "ArrowRight":
        swapImage = !swapImage;
        player.style.backgroundImage = `url('${!basketball ? "aimen" : "ludwig"}_${swapImage ? 1 : 2}.png')`;
        player.style.transform = "scaleX(1)";
        movePlayer(step, 0);
        break;
      case " ":
        if (basketball && !aimenIsShooting) {
          shootBall();
        }
        break;
    }
  }
});

function shootBall() {
  ball.style.display = "block";
  let ballPosition = { x: playerPosition.x + 15, y: playerPosition.y };
  ball.style.left = ballPosition.x + "px";
  ball.style.top = ballPosition.y + "px";

  const rimRect = rim.getBoundingClientRect();
  const gameBoardRect = gameBoard.getBoundingClientRect();
  let rimPosition = {
    x: rimRect.left - gameBoardRect.left,
    y: rimRect.top - gameBoardRect.top,
  };

  const aimenRect = aimen.getBoundingClientRect();
  let aimenPosition = {
    x: aimenRect.left - gameBoardRect.left,
    y: aimenRect.top - gameBoardRect.top,
  };

  let dx = rimPosition.x - ballPosition.x;
  let dy = rimPosition.y - ballPosition.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let directionX = dx / distance;
  let directionY = dy / distance;

  function moveBall() {
    ballPosition.x += directionX * ballSpeed;
    ballPosition.y += directionY * ballSpeed;

    ball.style.left = ballPosition.x + "px";
    ball.style.top = ballPosition.y + "px";

    if (Math.abs(ballPosition.x - aimenPosition.x) < 40 && Math.abs(ballPosition.y - aimenPosition.y) < 40) {
      ball.style.display.none;
      aimenShootBall();
    } else if (Math.abs(ballPosition.x - rimPosition.x) < 5 && Math.abs(ballPosition.y - rimPosition.y) < 5) {
      ball.style.display.none;
      gameOver("ludwigEnd");
    } else if (ballPosition.x < 0 || ballPosition.x > gameBoard.offsetWidth || ballPosition.y < 0 || ballPosition.y > gameBoard.offsetHeight) {
      ball.style.display.none;
    } else {
      requestAnimationFrame(moveBall);
    }
  }

  requestAnimationFrame(moveBall);
}

function aimenShootBall() {
  ball.style.display = "block";
  aimenIsShooting = true;
  let aimenPosition = { x: aimen.offsetLeft + 15, y: aimen.offsetTop };
  ball.style.left = aimenPosition.x + "px";
  ball.style.top = aimenPosition.y + "px";

  const rimRect = rim.getBoundingClientRect();
  const gameBoardRect = gameBoard.getBoundingClientRect();
  let rimPosition = {
    x: rimRect.left - gameBoardRect.left,
    y: rimRect.top - gameBoardRect.top,
  };

  let dx = rimPosition.x - aimenPosition.x;
  let dy = rimPosition.y - aimenPosition.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let directionX = dx / distance;
  let directionY = dy / distance;

  function moveBall() {
    aimenPosition.x += directionX * ballSpeed;
    aimenPosition.y += directionY * ballSpeed;

    ball.style.left = aimenPosition.x + "px";
    ball.style.top = aimenPosition.y + "px";

    if (Math.abs(aimenPosition.x - rimPosition.x) < 5 && Math.abs(aimenPosition.y - rimPosition.y) < 5) {
      ball.style.display.none;
      gameOver("aimenEnd");
    } else if (aimenPosition.x < 0 || aimenPosition.x > gameBoard.offsetWidth || aimenPosition.y < 0 || aimenPosition.y > gameBoard.offsetHeight) {
      ball.style.display.none;
    } else {
      requestAnimationFrame(moveBall);
    }
  }

  requestAnimationFrame(moveBall);
}

function startGame() {
  initGame();
  gameLoop();
}

function gameLoop() {
  if (gameRunning) {
    moveCars();
    checkCollisions();
    if (basketball && !aimenIsShooting) {
      moveAimen();
    }
  }
  requestAnimationFrame(gameLoop);
}

function checkCollisions() {
  if (basketball) {
    ballRimCollision();
    playerAimenCollision();
  } else {
    carCollision();
    playerBasketballHallCollision();
  }
}

function moveAimen() {
  let dx = playerPosition.x - aimenPosition.x;
  let dy = playerPosition.y - aimenPosition.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let directionX = dx / distance;
  let directionY = dy / distance;

  aimenPosition.x += directionX * aimenSpeed;
  aimenPosition.y += directionY * aimenSpeed;

  aimen.style.left = aimenPosition.x + "px";
  aimen.style.top = aimenPosition.y + "px";
}

function ballRimCollision() {
  if (collision(rim.getBoundingClientRect(), ball.getBoundingClientRect())) {
  }
}

function ballAimenCollision() {
  if (collision(aimen.getBoundingClientRect, ball.getBoundingClientRect())) {
    aimenShootBall();
  }
}

function playerAimenCollision() {
  if (collision(aimen.getBoundingClientRect(), player.getBoundingClientRect()) && !aimenIsShooting) {
    aimenIsShooting = true;
    aimenShootBall();
  }
}

function carCollision() {
  cars.forEach((car, index) => {
    if (collision(player.getBoundingClientRect(), car.getBoundingClientRect())) {
      aimenHP.innerText = parseInt(aimenHP.innerText) - 10;
      aimenAudio.volume = 1;
      aimenAudio.play();    
      if (parseInt(aimenHP.innerText) === 0) {
        gameOver("carEnd");
      }
      player.classList.add("shake");
      setTimeout(() => {
        player.classList.remove("shake");
      }, 500);
      carData[index].y = -400;
      car.style.top = carData[index].y + "px";
    }
  });
}

function playerBasketballHallCollision() {
  if (collision(player.getBoundingClientRect(), basketBallHall.getBoundingClientRect()) && !aimenIsShooting) {
    initBasketball();
  }
}

function collision(rect_1, rect_2) {
  return rect_1.left < rect_2.right && rect_1.right > rect_2.left && rect_1.top < rect_2.bottom && rect_1.bottom > rect_2.top;
}

function gameOver(ending) {
  gameRunning = false;
  battleAudio.pause();
  if (ending === "carEnd") {
    aimenDeadAudio.volume = 1;
    aimenDeadAudio.play();
    loseAudio.volume = 1;
    loseAudio.play();
    gameOverScreen.querySelector("p").textContent = "You got hit by too many cars!!! DON'T LET AIDEN DOWN!";
    gameOverScreen.style.backgroundImage = "url('aimen_dead.jpg')";
  } else if (ending === "ludwigEnd") {
    ludwigWon = true;
    gameOverScreen.querySelector("p").textContent = "SWIIISSH! YOU MADE THE SHOT!! THATS A WIN!!";
    gameOverScreen.style.backgroundImage = "url('swish.png')";
    winAudio.volume = 1;
    winAudio.play();
    clappingAudio.volume = .5;
    clappingAudio.play();
  } else if (ending === "aimenEnd" && !ludwigWon) {
    gameOverScreen.querySelector("p").textContent = "AIMEN MADE THE SHOT!! You lost :(((";
    gameOverScreen.style.backgroundImage = "url('lost.jpg')";
    loseAudio.volume = 1;
    loseAudio.play();
    aimenLoseAudio.volume = 1;
    aimenLoseAudio.play();
  };
  gameOverScreen.style.display = "block";
}

function moveCars() {
  cars.forEach((car, index) => {
    carData[index].y += TENTIMESFASTERTHANFROGGER;
    if (carData[index].y > gameBoard.offsetHeight) {
      carData[index].y = -50;
    }
    car.style.left = carData[index].x + "px";
    car.style.top = carData[index].y + "px";
  });
}

function movePlayer(xChange, yChange) {
  playerPosition.x += xChange;
  playerPosition.y += yChange;
  if (playerPosition.x < 0) playerPosition.x = 0;
  if (playerPosition.x > gameBoard.offsetWidth - player.offsetWidth) playerPosition.x = gameBoard.offsetWidth - player.offsetWidth;
  if (playerPosition.y < 0) playerPosition.y = 0;
  if (playerPosition.y > gameBoard.offsetHeight - player.offsetHeight) playerPosition.y = gameBoard.offsetHeight - player.offsetHeight;

  player.style.left = playerPosition.x + "px";
  player.style.top = playerPosition.y + "px";
}

function initBasketball() {
  introAudio.pause();
  battleAudio.volume = 0.4;
  battleAudio.play();
  cars.forEach((car) => {
    car.style.display = "none";
  });
  basketBallHall.style.display = "none";
  step = 30;
  aimenSpeed = aimenSpeed * (aimenHP.innerText * 0.04);

  rim.style.display = "block";

  gameBoard.style.backgroundImage = "url('court.jpeg')";
  gameBoard.style.backgroundSize = "cover";
  gameBoard.style.backgroundRepeat = "no-repeat";
  gameBoard.style.backgroundPosition = "center";

  aimen.style.display = "block";
  aimen.style.left = aimenPosition.x + "px";
  aimen.style.top = aimenPosition.y + "px";
  gameBoard.appendChild(aimen);

  playerPosition = { x: 160, y: 400 };
  player.style.left = playerPosition.x + "px";
  player.style.top = playerPosition.y + "px";
  player.style.backgroundImage = "url('ludwig_1.png')";

  basketball = true;
}

function initGame() {
  introAudio.loop = true;
  introAudio.volume = 0.7;
  introAudio.play();

  startAudio.volume = 0.2;
  startAudio.play();

  setInterval(updateTimer, 1000);
  document.getElementsByClassName("aimenHP")[0].style.visibility = "visible";
  gameOverScreen.style.display = "none";
  gameBoard.style.display = "block";
  gameIntro.style.display = "none";
  aimenHP.innerText = 100;
  playerPosition.x = 0;
  playerPosition.y = 200;
  player.style.left = playerPosition.x + "px";
  player.style.top = playerPosition.y + "px";
  basketBallHall.style.display = "block";

  cars.forEach((car, index) => {
    car.style.display = "block";
    car.style.left = carData[index].x + "px";
    car.style.top = carData[index].y + "px";
  });
  gameRunning = true;
}

function updateTimer() {
  if (timeLeft <= 0) {
    if (!basketball) {
      clearInterval(timerInterval);
      gameRunning = false;  
    }
  } else {
    timeLeft--;
  }
}