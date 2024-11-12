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

  // Update the results on the page
  document.getElementById('minFlyingSpeed').textContent = minFlyingSpeed;
  document.getElementById('vrefSpeed').textContent = vrefSpeed;
  document.getElementById('adjustedSpeed').textContent = adjustedSpeed;
  document.getElementById('liftIncreaseVref').textContent = liftIncreaseVref;
  document.getElementById('liftIncreaseMin').textContent = liftIncreaseMin;

  // Generate data for the chart
  const labels = ['Minimum Flying Speed', 'VREF Speed', `${windCorrection} Knots Added To VREF`];
  const liftData = [liftMin, liftVref, liftAdjusted];

  // Update or create the chart
  updateChart(labels, liftData);
}

let liftChart; // Global variable to hold the chart instance

function updateChart(labels, liftData) {
  const ctx = document.getElementById('liftChart').getContext('2d');
  
  const chartLabels = ['Minimum Flying Speed', 'VREF Speed', `${windCorrection} Knots Added To VREF`];

  if (liftChart) {
    liftChart.data.labels = chartLabels;
    liftChart.data.datasets[0].data = liftData;
    liftChart.update();
  } else {
    liftChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Lift (lbs)',
          data: liftData,
          backgroundColor: ['#4e73df', '#36b9cc', '#1cc88a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
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
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: function(value) {
              return `${value.toLocaleString()} lbs`;
            },
            font: {
              size: 12
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(20000, Math.max(...liftData) * 1.1),
            title: {
              display: true,
              text: 'Lift (lbs)',
              font: {
                size: 12
              }
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          x: {
            title: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              },
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
}