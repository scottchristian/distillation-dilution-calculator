document.addEventListener('DOMContentLoaded', () => {
    const currentPctInput = document.getElementById('current-pct');
    const currentVolInput = document.getElementById('current-vol');
    const targetPctInput = document.getElementById('target-pct');
    const unitToggles = document.querySelectorAll('input[name="unit"]');
    
    const resultContainer = document.getElementById('result-container');
    const waterAmountSpan = document.getElementById('water-amount');
    const resultUnitSpan = document.getElementById('result-unit');
    const totalVolSpan = document.getElementById('total-vol');
    const totalUnitSpan = document.getElementById('total-unit');

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
            totalVolSpan.textContent = v1.toFixed(c1 === c2 ? 0 : 2);
            resultContainer.classList.remove('hidden');
            return;
        }

        // V2 = V1 * (C1 / C2)
        // V_water = V2 - V1
        const v2 = v1 * (c1 / c2);
        const vWater = v2 - v1;

        // Display results
        waterAmountSpan.textContent = formatNumber(vWater);
        resultUnitSpan.textContent = unit;
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
        input.addEventListener('input', calculate);
    });

    unitToggles.forEach(toggle => {
        toggle.addEventListener('change', calculate);
    });
});
