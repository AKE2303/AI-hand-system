const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const salom = document.getElementById("salom");
const terminal = document.getElementById("terminal");
const terminalText = document.getElementById("terminal-text");

let hackerInterval = null;

const hands = new Hands({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

function isHandUp(landmarks) {
  return landmarks[8].y < landmarks[0].y;
}

function startHackerMode() {
  if (hackerInterval) return;

  hackerInterval = setInterval(() => {
    terminalText.textContent +=
      "\n> access_granted_" + Math.random().toString(36).substring(2);
    terminal.scrollTop = terminal.scrollHeight;
  }, 200);
}

function stopHackerMode() {
  clearInterval(hackerInterval);
  hackerInterval = null;
}

hands.onResults(results => {
  salom.style.display = "none";
  terminal.style.display = "none";
  stopHackerMode();

  if (!results.multiHandLandmarks) return;

  let leftUp = false;
  let rightUp = false;

  results.multiHandedness.forEach((hand, i) => {
    const up = isHandUp(results.multiHandLandmarks[i]);

    if (hand.label === "Left" && up) leftUp = true;
    if (hand.label === "Right" && up) rightUp = true;
  });

  // O‘NG qo‘l → Salom
  if (rightUp && !leftUp) {
    salom.style.display = "block";
  }

  // CHAP qo‘l → Terminal
  if (leftUp && !rightUp) {
    terminal.style.display = "block";
  }

  // IKKALASI → Hacker Mode
  if (leftUp && rightUp) {
    terminal.style.display = "block";
    startHackerMode();
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();
