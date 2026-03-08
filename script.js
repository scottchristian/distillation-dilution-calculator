document.addEventListener('DOMContentLoaded', () => {
    const currentPctInput = document.getElementById('current-pct');
    const currentVolInput = document.getElementById('current-vol');
    const targetPctInput = document.getElementById('target-pct');
    const unitToggles = document.querySelectorAll('input[name="unit"]');
    
    const resultContainer = document.getElementById('result-container');
    const errorMessage = document.getElementById('error-message');
    const waterAmountSpan = document.getElementById('water-amount');
    const resultUnitSpan = document.getElementById('result-unit');
    const waterAmountAltSpan = document.getElementById('water-amount-alt');
    const resultUnitAltSpan = document.getElementById('result-unit-alt');
    const totalVolSpan = document.getElementById('total-vol');
    const totalUnitSpan = document.getElementById('total-unit');

    // Prevent non-numeric characters in text inputs
    function validateNumericInput(e) {
        const input = e.target;
        const val = input.value;
        const cleanVal = val.replace(/[^0-9.]/g, ''); // Remove non-digits/dots
        
        // Ensure only one decimal point
        const parts = cleanVal.split('.');
        if (parts.length > 2) {
            input.value = parts[0] + '.' + parts.slice(1).join('');
        } else {
            input.value = cleanVal;
        }
    }

    function calculate() {
        const c1 = parseFloat(currentPctInput.value);
        const v1 = parseFloat(currentVolInput.value);
        const c2 = parseFloat(targetPctInput.value);
        const selectedUnit = document.querySelector('input[name="unit"]:checked').value;

        // Reset display
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
        resultContainer.classList.add('hidden');

        // Initial check: are all fields filled?
        if (currentPctInput.value === '' || currentVolInput.value === '' || targetPctInput.value === '') {
            return;
        }

        // Parse numbers again to handle non-numeric text gracefully
        if (isNaN(c1) || isNaN(v1) || isNaN(c2)) {
            return;
        }

        // Validation: Target cannot be higher than current
        if (c2 > c1) {
            errorMessage.textContent = 'Target % cannot be higher than current alcohol %';
            errorMessage.classList.remove('hidden');
            return;
        }

        // If c2 is 0, we can't divide by zero
        if (c2 <= 0) {
            return;
        }

        // V2 = V1 * (C1 / C2)
        // WaterToAdd = V2 - V1
        const v2 = (v1 * c1) / c2;
        const waterToAdd = v2 - v1;

        // Display results
        waterAmountSpan.textContent = formatNumber(waterToAdd);
        resultUnitSpan.textContent = selectedUnit;

        // Alternative unit calculation
        if (selectedUnit === 'ml') {
            waterAmountAltSpan.textContent = formatNumber(waterToAdd / 1000);
            resultUnitAltSpan.textContent = 'L';
            totalVolSpan.textContent = formatNumber(v2); // Total volume remains in ml for this display
            totalUnitSpan.textContent = selectedUnit; // Total unit remains in ml for this display
        } else { // selectedUnit is 'L'
            waterAmountAltSpan.textContent = formatNumber(waterToAdd * 1000);
            resultUnitAltSpan.textContent = 'ml';
            totalVolSpan.textContent = formatNumber(v2); // Total volume remains in L for this display
            totalUnitSpan.textContent = selectedUnit; // Total unit remains in L for this display
        }

        // Show results with transition
        resultContainer.classList.remove('hidden');
    }

    function formatNumber(num) {
        if (num === 0) return "0";
        if (num < 0.01) return num.toFixed(4);
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    // Event Listeners
    [currentPctInput, currentVolInput, targetPctInput].forEach(input => {
        input.addEventListener('input', validateNumericInput); // Add this
        input.addEventListener('input', calculate);
    });

    unitToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const newUnit = e.target.value;
            const currentVal = parseFloat(currentVolInput.value);

            if (!isNaN(currentVal)) {
                if (newUnit === 'l') {
                    // ml -> L
                    currentVolInput.value = parseFloat((currentVal / 1000).toFixed(4));
                } else {
                    // L -> ml
                    currentVolInput.value = parseFloat((currentVal * 1000).toFixed(2));
                }
            }
            calculate();
        });
    });

    // Custom Controls Logic
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.getAttribute('data-for');
            const input = document.getElementById(inputId);
            const step = parseFloat(input.getAttribute('step')) || 1;
            const isPlus = btn.classList.contains('plus');
            
            let val = parseFloat(input.value) || 0;
            if (isPlus) {
                val += step;
            } else {
                val -= step;
            }
            
            // Constrain 0-100 for percentages
            if (inputId.includes('pct')) {
                val = Math.max(0, Math.min(100, val));
            } else {
                val = Math.max(0, val);
            }

            // Fix floating point math (e.g. 0.1 + 0.2 = 0.30000000000000004)
            input.value = parseFloat(val.toFixed(2));
            
            // Trigger calculation
            calculate();
        });
    });
});
