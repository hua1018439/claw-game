const claw = document.getElementById("claw");
const coinContainer = document.getElementById("coinContainer");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const machine = document.querySelector(".machine");

let coins = 6;
let score = 0;
let timer = 10;
let timerId = null;
let isGrabbing = false;
let clawXPercent = 24.5;
const clawStepPercent = 4.5;

function updateCoins() {
  coinContainer.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const img = document.createElement("img");
    img.src = i < coins ? "picture/coin.png" : "picture/nocoin.png";
    coinContainer.appendChild(img);
  }
}

function updateScore() {
  scoreDisplay.textContent = `score: ${score}`;
}

function updateTimer() {
  if (timerDisplay) {
    timerDisplay.textContent = `Time remaining: ${timer}s`;
  }
}

function updateClawPosition() {
  const machineWidth = machine.getBoundingClientRect().width;
  claw.style.left = `${(clawXPercent / 100) * machineWidth}px`;
}

function moveLeft() {
  if (coins === 0 || isGrabbing) return;
  clawXPercent = Math.max(clawXPercent - clawStepPercent, 0);
  updateClawPosition();
}

function moveRight() {
  if (coins === 0 || isGrabbing) return;
  clawXPercent = Math.min(clawXPercent + clawStepPercent, 100);
  updateClawPosition();
}

function startTimer() {
  clearInterval(timerId);
  timer = 10;
  updateTimer();

  timerId = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      clearInterval(timerId);
      if (!isGrabbing) {
        isGrabbing = true;
        handleResult(false);
      }
    }
  }, 1000);
}

function grab() {
  if (coins === 0 || isGrabbing) return;
  isGrabbing = true;
  clearInterval(timerId);
  claw.style.top = "100px";

  setTimeout(() => {
    const machineWidth = machine.getBoundingClientRect().width;
    const clawCenter =
      (clawXPercent / 100) * machineWidth + 0.5 * claw.offsetWidth;
    let newImage = "";
    let isSuccess = false;

    const zones = [
      { min: 230, max: 290, image: "picture/chocolate.png" },
      { min: 320, max: 370, image: "picture/donut1.png" },
      { min: 400, max: 450, image: "picture/cake.png" },
      { min: 460, max: 520, image: "picture/donut2.png" },
    ];

    for (const zone of zones) {
      if (clawCenter >= zone.min && clawCenter <= zone.max) {
        newImage = zone.image;
        isSuccess = Math.random() < 0.8;
        break;
      }
    }

    if (isSuccess && newImage) {
      claw.src = newImage;
    }

    handleResult(isSuccess);
  }, 500);
}

function handleResult(isSuccess) {
  coins--;
  score += isSuccess ? 100 : -50;
  updateCoins();
  updateScore();
  updateTimer();

  claw.style.top = "0px";

  setTimeout(() => {
    alert(isSuccess ? "夾取成功！總分+100分" : "夾取失敗 總分-50分");
    claw.src = "picture/claw.png";
    clawXPercent = 24.5;
    updateClawPosition();
    isGrabbing = false;

    if (coins > 0) {
      startTimer();
    } else {
      alert("硬幣用完囉！遊戲結束～您的總分是 " + score + " 分");
    }
  }, 400);
}

updateCoins();
updateScore();
updateTimer();
updateClawPosition();
startTimer();
