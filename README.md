# HondaJet Lift Increase Calculator

## Overview
The HondaJet Lift Increase Calculator is a web-based tool designed to help pilots understand the relationship between aircraft speed and lift during approach and landing phases. This calculator specifically focuses on the HondaJet aircraft and provides insights into how different approach speeds affect the total lift generated.

## Features
- Calculate Minimum Flying Speed based on landing weight
- Determine VREF (Reference Speed) for approach
- Account for additional speed a pilot may add to VREF
- Visualize lift increases through an interactive chart
- Real-time calculations and updates

## How It Works

### 1. Input Parameters
- **Landing Weight**: Must be between 7,500 lbs and 11,100 lbs
- **Additional Speed Above VREF**: Must be 0 or greater (in knots)

### 2. Speed Calculations

#### Minimum Flying Speed (V_min)
The calculator uses two known data points to establish a relationship between weight and minimum flying speed:
- At 7,000 lbs → 80 knots
- At 11,100 lbs → 101 knots

The relationship follows the formula:

V_min = k × √W

Where:
- V_min is the minimum flying speed
- k is a constant derived from known data points
- W is the aircraft weight

The k-value is calculated by averaging two known conditions:

k1 = 80 / √7000
k2 = 101 / √11100
k = (k1 + k2) / 2

#### VREF Speed
VREF is calculated as 1.23 times stall speed:

V_ref = 1.23 × V_min

#### Wind-Adjusted Approach Speed
The final approach speed adds the additional speed a pilot may add to VREF:

V_approach = V_ref + Additional_speed

### 3. Lift Calculations

The calculator uses the fundamental relationship between lift and velocity:

L ∝ V²

At minimum flying speed (V_min), lift equals weight. As speed increases, lift increases according to the square of the velocity ratio:

L = W × (V / V_min)²

Lift increases are calculated as percentages:
- Increase from VREF: ((L_adjusted / L_vref) - 1) × 100
- Increase from Minimum Flying Speed: ((L_adjusted / L_min) - 1) × 100

## Technical Implementation

### Frontend
- HTML5 for structure
- CSS3 for styling
- JavaScript for calculations and interactivity
- Chart.js for data visualization

### Key Features
- Real-time input validation
- Responsive design
- Interactive chart updates
- Precise mathematical calculations

## Limitations and Disclaimers
- Calculations are based on standard pressure and temperature conditions
- Assumes landing flap configuration
- Lift increase represents the maximum possible increase
- For educational purposes only
- Not a replacement for official aircraft documentation
- Always refer to the Aircraft Flight Manual (AFM) for operational decisions

## Usage
1. Enter the aircraft's landing weight (7,500 - 11,100 lbs)
2. Input any additional speed above VREF (0 or greater)
3. Click "Calculate" or let the values update automatically
4. Review the calculated speeds and lift increases
5. Refer to the chart for visual representation of lift increases

## Installation
No installation required. Access the calculator through any modern web browser.

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing
Feel free to submit issues and enhancement requests.

## Author
Carson Lee

## Acknowledgments
- HondaJet performance data