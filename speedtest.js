const canvas = document.getElementById('speedometer');
const ctx = canvas.getContext('2d');
const speedText = document.getElementById('speedText');
const btn = document.getElementById('speedNowBtn');

async function runTest() {
  const backend = "http://localhost:3000"; // korvaa oikealla backend URL:llä

  // Ping
  let start = performance.now();
  await fetch(backend + "/ping");
  let ping = Math.round(performance.now() - start);
  document.getElementById("ping").innerText = "Ping: " + ping + " ms";

  // Download
  start = performance.now();
  let dlRes = await fetch(backend + "/download?size=10000000");
  let blob = await dlRes.blob();
  let dlTime = (performance.now() - start) / 1000;
  let dlMbps = ((blob.size * 8) / dlTime / 1e6).toFixed(2);
  document.getElementById("download").innerText = "Download: " + dlMbps + " Mbps";

  // Upload
  let randomData = new Uint8Array(5 * 1024 * 1024);
  crypto.getRandomValues(randomData);
  start = performance.now();
  await fetch(backend + "/upload", { method:"POST", body:randomData });
  let ulTime = (performance.now() - start) / 1000;
  let ulMbps = ((randomData.length * 8) / ulTime / 1e6).toFixed(2);
  document.getElementById("upload").innerText = "Upload: " + ulMbps + " Mbps";

  // IP & ISP
  let ipInfo = await fetch("https://ipapi.co/json/");
  let data = await ipInfo.json();
  document.getElementById("ip").innerText = "IP: " + data.ip;
  document.getElementById("isp").innerText = "ISP: " + data.org;
  document.getElementById("location").innerText = "Sijainti: " + data.city + ", " + data.country_name;

  // Animoi ratti (downloadin perusteella)
  animateSpeedometer(dlMbps);
}

btn.addEventListener("click", runTest);

// Yksinkertainen ratti + kaasu -animaatio
function animateSpeedometer(speed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mittarin kaari
  ctx.beginPath();
  ctx.arc(150, 150, 100, Math.PI, 0, false);
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#333';
  ctx.stroke();

  // “Kaasupoljin” viiva
  const angle = Math.PI + (speed / 1000) * Math.PI; // 0-1000 Mbps
  ctx.beginPath();
  ctx.moveTo(150,150);
  ctx.lineTo(150 + 100*Math.cos(angle), 150 + 100*Math.sin(angle));
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#00b8ff';
  ctx.stroke();

  speedText.innerText = speed + " Mbps";
}
