// Smooth scroll for hero/nav buttons
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Tabs behavior
document.querySelectorAll('[data-tabs]').forEach(tabset => {
  const tabs = tabset.querySelectorAll('.tab-list button');
  const panels = tabset.querySelectorAll('.tab-panel');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      panels[i].classList.add('active');
    });
  });
});

// Market matching simulation
const buyers = [
  { name: 'Buyer A', minQuality: 75, maxDistance: 300, price: 1.2 },
  { name: 'Buyer B', minQuality: 80, maxDistance: 150, price: 1.35 },
  { name: 'Buyer C', minQuality: 70, maxDistance: 500, price: 1.1 },
  { name: 'Buyer D', minQuality: 85, maxDistance: 100, price: 1.45 }
];

function simulateMatches(quality, maxDistance) {
  const matches = buyers
    .filter(b => quality >= b.minQuality && maxDistance <= b.maxDistance)
    .sort((a, b) => b.price - a.price);
  return matches;
}

document.getElementById('simulateMatch')?.addEventListener('click', () => {
  const q = Number(document.getElementById('qualityRange').value);
  const d = Number(document.getElementById('distanceInput').value);
  const matches = simulateMatches(q, d);
  const out = document.getElementById('matchOutput');
  if (matches.length === 0) {
    out.innerHTML = `<p>No matches found. Consider increasing max distance or improving quality via storage adjustments.</p>`;
  } else {
    out.innerHTML = `
      <ul class="bullets">
        ${matches.map(m => `<li><strong>${m.name}:</strong> Target price $${m.price.toFixed(2)}/kg, min quality ${m.minQuality}, max distance ${m.maxDistance}km</li>`).join('')}
      </ul>
    `;
  }
});

// Dashboard KPIs and charts (simulated)
const roleSelect = document.getElementById('roleSelect');
const regionSelect = document.getElementById('regionSelect');
const cropSelect = document.getElementById('cropSelect');
const kpiYield = document.getElementById('kpiYield');
const kpiSpoilage = document.getElementById('kpiSpoilage');
const kpiPrice = document.getElementById('kpiPrice');

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function updateKPIs() {
  const role = roleSelect.value;
  const region = regionSelect.value;
  const crop = cropSelect.value;
  // Simple role- and region-based simulation
  let baseYield = { maize: 3.2, cassava: 7.8, tomato: 20.5, beans: 1.6 }[crop];
  let regionFactor = { kenya: 1.0, nigeria: 0.95, ssa: 0.9, custom: 1.05 }[region];
  let roleFactor = { farmer: 1.0, cooperative: 1.1, government: 1.2, distributor: 0.9 }[role];
  const yieldTonsPerHa = (baseYield * regionFactor * roleFactor + Math.random() * 0.2).toFixed(1);

  const spoilage = randomBetween(8, 22); // % risk in 7–14 days
  const priceTrend = ['↑ rising', '→ stable', '↓ falling'][randomBetween(0, 2)];

  kpiYield.textContent = `${yieldTonsPerHa} t/ha`;
  kpiSpoilage.textContent = `${spoilage}%`;
  kpiPrice.textContent = priceTrend;

  drawStorageChart();
  drawRiskMap(spoilage);
  updateLedger();
}

document.getElementById('applyFilters')?.addEventListener('click', updateKPIs);
window.addEventListener('load', updateKPIs);

// Canvas chart: storage conditions
function drawStorageChart() {
  const canvas = document.getElementById('storageChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Axes
  ctx.strokeStyle = '#253154';
  ctx.beginPath();
  ctx.moveTo(40, 10); ctx.lineTo(40, 180);
  ctx.moveTo(40, 180); ctx.lineTo(590, 180);
  ctx.stroke();

  // Simulated series: Temperature, Humidity, CO2
  const points = 12;
  const temp = Array.from({ length: points }, () => 16 + Math.random() * 10);
  const hum = Array.from({ length: points }, () => 55 + Math.random() * 20);
  const co2 = Array.from({ length: points }, () => 400 + Math.random() * 200);

  function plot(series, color, scaleFn) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    series.forEach((v, i) => {
      const x = 40 + (i * (550 / (points - 1)));
      const y = scaleFn(v);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  // Map values to canvas Y
  const scaleTemp = v => 180 - ((v - 10) / 30) * 160;
  const scaleHum = v => 180 - ((v - 40) / 60) * 160;
  const scaleCO2 = v => 180 - ((v - 350) / 400) * 160;

  plot(temp, '#22c55e', scaleTemp);
  plot(hum, '#38bdf8', scaleHum);
  plot(co2, '#f59e0b', scaleCO2);

  // Legend
  ctx.fillStyle = '#a9b5d9';
  ctx.fillText('Temp (°C)', 500, 20);
  ctx.fillText('Humidity (%)', 500, 35);
  ctx.fillText('CO₂ (ppm)', 500, 50);
}

// Risk map heat visualization
function drawRiskMap(spoilagePercent) {
  const map = document.getElementById('riskMap');
  map.innerHTML = '';
  const blocks = 40;
  for (let i = 0; i < blocks; i++) {
    const b = document.createElement('div');
    const risk = Math.max(0, Math.min(100, spoilagePercent + (Math.random() * 20 - 10)));
    const red = Math.round(15 + (risk / 100) * 180);
    const green = Math.round(23 + (100 - risk) / 100 * 120);
    b.style.position = 'absolute';
    b.style.width = '10%';
    b.style.height = '20%';
    b.style.left = `${(i % 10) * 10}%`;
    b.style.top = `${Math.floor(i / 10) * 20}%`;
    b.style.background = `rgba(${red}, ${green}, 60, 0.6)`;
    map.appendChild(b);
  }
}

// Blockchain ledger sample rows
function updateLedger() {
  const body = document.getElementById('ledgerBody');
  const rows = [
    { id: '0xA1F2', event: 'Harvest logged', actor: 'Farmer#102', time: '2025-10-10 08:10', ok: true },
    { id: '0xB44C', event: 'Storage entry', actor: 'Coop#12', time: '2025-10-10 08:35', ok: true },
    { id: '0xC77D', event: 'Sensor anomaly', actor: 'IoT#Rack-5', time: '2025-10-10 09:05', ok: false },
    { id: '0xD55E', event: 'Quality certification', actor: 'Gov#QA-3', time: '2025-10-10 10:20', ok: true }
  ];
  body.innerHTML = rows.map(r =>
    `<tr>
      <td>${r.id}</td>
      <td>${r.event}</td>
      <td>${r.actor}</td>
      <td>${r.time}</td>
      <td style="color:${r.ok ? '#22c55e' : '#ef4444'}">${r.ok ? 'Valid' : 'Alert'}</td>
    </tr>`
  ).join('');
}

// Contact form (client-side only demo)
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const status = document.getElementById('formStatus');
  status.textContent = `Thanks, ${data.name}. We’ll reach out at ${data.email}.`;
  form.reset();
});