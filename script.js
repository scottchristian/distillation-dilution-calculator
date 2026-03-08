document.addEventListener('DOMContentLoaded', () => {
    const currentPctInput = document.getElementById('current-pct');
    const currentVolInput = document.getElementById('current-vol');
    const targetPctInput = document.getElementById('target-pct');
    const unitToggles = document.querySelectorAll('input[name="unit"]');
    
    const resultContainer = document.getElementById('result-container');
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
        const unit = document.querySelector('input[name="unit"]:checked').value;

        // Update placeholder based on unit
        currentVolInput.placeholder = `e.g. ${unit === 'ml' ? '1000' : '1'}`;

        if (isNaN(c1) || isNaN(v1) || isNaN(c2) || c1 <= 0 || v1 <= 0 || c2 <= 0) {
            resultContainer.classList.add('hidden');
            return;
        }

        // Only hide if we actually have no numbers at all
        if (!currentPctInput.value || !currentVolInput.value || !targetPctInput.value) {
            resultContainer.classList.add('hidden');
            return;
        }

        if (c2 >= c1) {
            // Can't "dilute" to a higher percentage
            waterAmountSpan.textContent = "0";
            waterAmountAltSpan.textContent = "0";
            resultUnitAltSpan.textContent = unit === 'ml' ? 'L' : 'ml';
            totalVolSpan.textContent = v1.toFixed(c1 === c2 ? 0 : 2);
            resultContainer.classList.remove('hidden');
            return;
        }

        // V2 = V1 * (C1 / C2)
        // V_water = V2 - V1
        const v2 = v1 * (c1 / c2);
        const vWater = v2 - v1;

        // Calculate Alt Unit
        let vWaterAlt, altUnit;
        if (unit === 'ml') {
            vWaterAlt = vWater / 1000;
            altUnit = 'L';
        } else {
            vWaterAlt = vWater * 1000;
            altUnit = 'ml';
        }

        // Display results
        waterAmountSpan.textContent = formatNumber(vWater);
        resultUnitSpan.textContent = unit;
        
        waterAmountAltSpan.textContent = formatNumber(vWaterAlt);
        resultUnitAltSpan.textContent = altUnit;

        totalVolSpan.textContent = formatNumber(v2);
        totalUnitSpan.textContent = unit;

        resultContainer.classList.remove('hidden');
    }

    function formatNumber(num) {
        if (num >= 100) {
            return Math.round(num).toLocaleString();
        } else if (num >= 10) {
            return num.toFixed(1);
        } else {
            return num.toFixed(2);
        }
    }

    // Event Listeners
    [currentPctInput, currentVolInput, targetPctInput].forEach(input => {
        input.addEventListener('input', validateNumericInput); // Add this
        input.addEventListener('input', calculate);
    });

    unitToggles.forEach(toggle => {
        toggle.addEventListener('change', calculate);
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
