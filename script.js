const video = document.getElementById('video');
const statusText = document.getElementById('status');

// Load models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/')
]).then(startVideo);

// Start camera
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      console.log("✅ Camera started");
      video.srcObject = stream;
    })
    .catch((err) => console.error("❌ Camera error:", err));
}

// Detect emotions
video.addEventListener('play', () => {
  const interval = setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections && detections.expressions) {
      const mood = Object.entries(detections.expressions)
        .sort((a, b) => b[1] - a[1])[0][0]; // strongest mood
      console.log("😀 Mood:", mood);
      statusText.innerText = `Mood detected: ${mood}`;
      
      // Change wallpaper color (demo)
      document.body.style.background =
        mood === "happy" ? "#ffe066" :
        mood === "sad"   ? "#a0c4ff" :
        mood === "angry" ? "#ff6b6b" : "#f5f5f5";
    } else {
      statusText.innerText = "Detecting mood...";
    }
  }, 2000); // every 2 sec
});