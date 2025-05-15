const video = document.getElementById('video');
const statusText = document.getElementById('status');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      statusText.textContent = "Detectando rosto...";
    })
    .catch(err => {
      statusText.textContent = "Erro ao acessar a câmera: " + err;
    });
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  let faceDetected = false;

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    if (detections.length > 0 && !faceDetected) {
      faceDetected = true;
      alert('Documento digital assinado');
      statusText.textContent = "Rosto detectado.";
    }
  }, 500);
});
