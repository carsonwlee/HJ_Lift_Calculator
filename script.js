// Add this at the top of script.js, outside any functions
let liftChart = null;

document.getElementById('calculateBtn').addEventListener('click', calculateLift);

// Call calculateLift on page load to perform initial calculation
window.onload = calculateLift;

function calculateLift() {
  const landingWeight = parseFloat(document.getElementById('landingWeight').value);
  const windCorrection = parseFloat(document.getElementById('windCorrection').value);

  // Validate landing weight
  if (landingWeight < 7500 || landingWeight > 11100) {
    alert('Landing weight must be between 7500 lbs and 11100 lbs.');
    return;
  }

  // Validate wind correction
  if (windCorrection < 0) {
    alert('Wind correction must be a non-negative number.');
    return;
  }

  // Constants derived from known data points
  // At 7,000 lbs, Minimum Flying Speed = 80 knots
  // At 11,100 lbs, Minimum Flying Speed = 101 knots
  const weight1 = 7000;
  const minFlyingSpeed1 = 80;
  const weight2 = 11100;
  const minFlyingSpeed2 = 101;
  const maxAoA = 15; // Critical AOA in degrees

  const k1 = minFlyingSpeed1 / Math.sqrt(weight1);
  const k2 = minFlyingSpeed2 / Math.sqrt(weight2);
  const k = (k1 + k2) / 2; // Average k

  // Calculate Minimum Flying Speed at the given weight
  const minFlyingSpeed = Math.round(k * Math.sqrt(landingWeight));

  // VREF Speed (1.23 times Minimum Flying Speed)
  const vrefSpeed = Math.round(minFlyingSpeed * 1.23);

  // Adjusted Approach Speed with Wind Correction
  const adjustedSpeed = Math.round(vrefSpeed + windCorrection);

  // Calculate lift at each speed
  // Lift at Minimum Flying Speed (Lift equals Weight)
  const liftMin = landingWeight;

  // Lift increases with the square of the speed ratio
  // L = W * (V / V_min)^2
  const liftVref = Math.round(liftMin * Math.pow(vrefSpeed / minFlyingSpeed, 2));
  const liftAdjusted = Math.round(liftMin * Math.pow(adjustedSpeed / minFlyingSpeed, 2));

  // Calculate percentage increase in lift compared to VREF
  const liftIncreaseVref = (((liftAdjusted / liftVref) - 1) * 100).toFixed(2);

  // Calculate percentage increase in lift compared to Minimum Flying Speed
  const liftIncreaseMin = (((liftAdjusted / liftMin) - 1) * 100).toFixed(2);

  // Calculate AOA at each speed
  // AOA is inversely proportional to the square of the velocity ratio
  const aoaMin = maxAoA.toFixed(1); // At minimum flying speed (max AOA)
  const aoaVref = (maxAoA * Math.pow(minFlyingSpeed / vrefSpeed, 2)).toFixed(1);
  const aoaAdjusted = (maxAoA * Math.pow(minFlyingSpeed / adjustedSpeed, 2)).toFixed(1);

  // Update display
  document.getElementById('minFlyingSpeed').textContent = minFlyingSpeed;
  document.getElementById('vrefSpeed').textContent = vrefSpeed;
  document.getElementById('adjustedSpeed').textContent = adjustedSpeed;
  document.getElementById('liftIncreaseVref').textContent = liftIncreaseVref;
  document.getElementById('liftIncreaseMin').textContent = liftIncreaseMin;
  document.getElementById('aoaMin').textContent = aoaMin;
  document.getElementById('aoaVref').textContent = aoaVref;
  document.getElementById('aoaAdjusted').parentElement.innerHTML = 
    `Angle of Attack at ${windCorrection}kts above VREF: <span id="aoaAdjusted">${aoaAdjusted}</span>°`;

  // Update lift chart
  const labels = ['Minimum Flying Speed', 'VREF Speed', `Speed at ${windCorrection}kts above VREF`];
  const liftData = [liftMin, liftVref, liftAdjusted];
  
  if (liftChart) {
    liftChart.data.labels = labels;
    liftChart.data.datasets[0].data = liftData;
    liftChart.update();
  } else {
    const ctx = document.getElementById('liftChart').getContext('2d');
    liftChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Lift (lbs)',
          data: liftData,
          backgroundColor: ['#4e73df', '#36b9cc', '#1cc88a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Lift (lbs)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Lift: ${context.parsed.y.toLocaleString()} lbs`;
              }
            }
          }
        }
      }
    });
  }
}
