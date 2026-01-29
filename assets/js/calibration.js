// Create grid lines
const grid = document.getElementById('backgroundGrid');
const numVertical = 12;
const numHorizontal = 32;
const center = 0.5;

function curvedDistribution(t, power = 2.5) {
    return Math.sign(t) * Math.pow(Math.abs(t), power);
}

for (let i = 0; i < numVertical; i++) {
    const line = document.createElement('div');
    line.className = 'vertical-line';
    line.style.left = (i / (numVertical - 1)) * 100 + '%';
    grid.appendChild(line);
}

for (let i = 0; i < numHorizontal; i++) {
    // Normalized index from -1 to 1
    let t = (i / (numHorizontal - 1)) * 2 - 1;

    // Skip the center area
    if (Math.abs(t) < 0.6) continue;

    // Compression near center
    let curved = curvedDistribution(t, 3);

    let top = center + curved * center;

    const line = document.createElement('div');
    line.className = 'horizontal-line';
    line.style.top = (top * 100) + '%';

    grid.appendChild(line);
}

// Mouse tracking
const reticle = document.getElementById('foregroundReticle');
const text = document.querySelector('.text');

document.addEventListener('mousemove', (e) => {
    reticle.style.left = e.clientX + 'px';
    reticle.style.top = e.clientY + 'px';

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) +
        Math.pow(e.clientY - centerY, 2)
    );

    if (distance < 20) {
        text.textContent = 'LOCKED IN';
        text.style.color = '#ff0000';
        text.style.textShadow = '0 0 20px #ff0000';
    } else {
        text.textContent = 'CLOSING IN';
        text.style.color = '#32cd32';
        text.style.textShadow = '0 0 10px #32cd32';
    }
});

// Center reticle initially
reticle.style.left = window.innerWidth / 2 + 'px';
reticle.style.top = window.innerHeight / 2 + 'px';